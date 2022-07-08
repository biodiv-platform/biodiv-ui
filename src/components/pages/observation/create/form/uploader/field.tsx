import {
  FormControl,
  FormErrorMessage,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import useDidUpdateEffect from "@hooks/use-did-update-effect";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";

import AudioInput from "./audio-input";
import FromURL from "./from-url";
import MyUploads from "./my-uploads";
import ResourcesList from "./observation-resources/resources-list";
import useObservationCreate from "./use-observation-resources";

export interface IDropzoneProps {
  name: string;
  mb?: number;
  isCreate?: boolean;
  children?;
  hidden?;
  onTabIndexChanged?;
}

const DropzoneField = ({ name, mb = 4, hidden, onTabIndexChanged }: IDropzoneProps) => {
  const { observationAssets, addAssets } = useObservationCreate();
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  const { field, fieldState } = useController({ name });

  useEffect(() => {
    observationAssets?.length && field.onChange(observationAssets);
  }, []);

  useEffect(() => {
    onTabIndexChanged && onTabIndexChanged(tabIndex);
  }, [tabIndex]);

  useDidUpdateEffect(() => {
    field.onChange(observationAssets);
  }, [observationAssets]);

  const onSelectionDone = () => setTabIndex(0);

  return (
    <FormControl hidden={hidden} isInvalid={!!fieldState.error} mb={mb}>
      <Tabs
        className="nospace"
        index={tabIndex}
        onChange={setTabIndex}
        variant="soft-rounded"
        isLazy={true}
      >
        <TabList mb={4} overflowX="auto" py={1}>
          <Tab>✔️ {t("form:selected_media")}</Tab>
          <Tab>☁️ {t("form:my_uploads")}</Tab>
          <Tab>🎙️ {t("form:audio.title")}</Tab>
          <Tab>📹 {t("form:from_url")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ResourcesList showHint={true} />
          </TabPanel>
          <TabPanel>
            <MyUploads onDone={onSelectionDone} />
          </TabPanel>
          <TabPanel>
            <AudioInput onDone={onSelectionDone} onSave={addAssets} />
          </TabPanel>
          <TabPanel>
            <FromURL onDone={onSelectionDone} onSave={addAssets} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <FormErrorMessage children={JSON.stringify(fieldState?.error?.message)} />
    </FormControl>
  );
};

export default DropzoneField;
