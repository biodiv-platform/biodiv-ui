import {
  FormControl,
  FormErrorMessage,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import AudioInput from "@components/pages/observation/create/form/uploader/audio-input";
import FromURL from "@components/pages/observation/create/form/uploader/from-url";
import MyUploads from "@components/pages/observation/create/form/uploader/my-uploads";
import ResourcesList from "@components/pages/observation/create/form/uploader/observation-resources/resources-list";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";

import SpeciesPullMedia from ".";

interface ISpeciesDropzoneField {
  name: string;
  isCreate?: boolean;
  children?;
}

const SpeciesDropzoneField = ({ name }: ISpeciesDropzoneField) => {
  const { field, fieldState } = useController({ name });
  const { observationAssets } = useObservationCreate();
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    field.onChange(observationAssets);
  }, [observationAssets]);

  const onSelectionDone = () => setTabIndex(0);

  return (
    <FormControl isInvalid={fieldState.invalid} minH="500px">
      <Tabs
        className="nospace"
        index={tabIndex}
        onChange={setTabIndex}
        variant="soft-rounded"
        isLazy={true}
      >
        <TabList mb={4} overflowX="auto" py={1}>
          <Tab>✔️ {t("form:selected_media")}</Tab>
          <Tab>🖼️ {t("species:pull_media")}</Tab>
          <Tab>☁️ {t("form:my_uploads")}</Tab>
          <Tab>🎙️ {t("form:audio.title")}</Tab>
          <Tab>📹 {t("form:from_url")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ResourcesList />
          </TabPanel>
          <TabPanel>
            <SpeciesPullMedia onDone={onSelectionDone} />
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
      <FormErrorMessage children={JSON.stringify(fieldState?.error?.message)} />
    </FormControl>
  );
};

export default SpeciesDropzoneField;
