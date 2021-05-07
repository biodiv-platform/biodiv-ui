import { FormControl, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { ErrorMessageMulti } from "@components/form/common/error-message";
import useTranslation from "@hooks/use-translation";
import { TOGGLE_PHOTO_SELECTOR } from "@static/events";
import React, { useEffect, useState } from "react";
import { emit } from "react-gbus";
import { UseFormMethods } from "react-hook-form";

import AudioInput from "./audio-input";
import FromURL from "./from-url";
import MyUploads from "./my-uploads";
import ResourcesList from "./observation-resources/resources-list";
import useObservationCreate from "./use-observation-resources";

export interface IDropzoneProps {
  name: string;
  mb?: number;
  form: UseFormMethods<Record<string, any>>;
  isCreate?: boolean;
  children?;
  hidden?;
}

const DropzoneField = ({ name, mb = 4, form, hidden }: IDropzoneProps) => {
  const { observationAssets } = useObservationCreate();
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    form.setValue(name, observationAssets, { shouldDirty: true });
  }, [observationAssets]);

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  useEffect(() => {
    emit(TOGGLE_PHOTO_SELECTOR, tabIndex !== 0);
  }, [tabIndex]);

  const onSelectionDone = () => setTabIndex(0);

  return (
    <FormControl hidden={hidden} isInvalid={form.errors[name] && true} mb={mb}>
      <Tabs
        className="nospace"
        index={tabIndex}
        onChange={setTabIndex}
        variant="soft-rounded"
        isLazy={true}
      >
        <TabList mb={4} overflowX="auto" py={1}>
          <Tab>✔️ {t("OBSERVATION.SELECTED_MEDIA")}</Tab>
          <Tab>☁️ {t("OBSERVATION.MY_UPLOADS")}</Tab>
          <Tab>🎙️ {t("OBSERVATION.AUDIO.TITLE")}</Tab>
          <Tab>📹 {t("OBSERVATION.FROM_URL")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ResourcesList showHint={true} />
          </TabPanel>
          <TabPanel>
            <MyUploads onDone={onSelectionDone} />
          </TabPanel>
          <TabPanel>
            <AudioInput onDone={onSelectionDone} />
          </TabPanel>
          <TabPanel>
            <FromURL onDone={onSelectionDone} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <ErrorMessageMulti errors={form.errors} name={name} />
    </FormControl>
  );
};

export default DropzoneField;
