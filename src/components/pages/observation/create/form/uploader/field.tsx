import {
  FormControl,
  FormErrorMessage,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/core";
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
}

const DropzoneField = ({ name, mb = 4, form }: IDropzoneProps) => {
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
    <FormControl isInvalid={form.errors[name] && true} mb={mb}>
      <Tabs index={tabIndex} onChange={setTabIndex} variant="soft-rounded">
        <TabList mb={4} overflowX="auto" py={1}>
          <Tab>✔️ {t("OBSERVATION.SELECTED_MEDIA")}</Tab>
          <Tab>☁️ {t("OBSERVATION.MY_UPLOADS")}</Tab>
          <Tab>🎙️ {t("OBSERVATION.AUDIO.TITLE")}</Tab>
          <Tab>📹 {t("OBSERVATION.FROM_URL")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <ResourcesList />
          </TabPanel>
          <TabPanel p={0}>
            <MyUploads onDone={onSelectionDone} />
          </TabPanel>
          <TabPanel p={0}>
            <AudioInput onDone={onSelectionDone} />
          </TabPanel>
          <TabPanel p={0}>
            <FromURL onDone={onSelectionDone} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <FormErrorMessage>
        {Array.isArray(form.errors[name])
          ? form.errors[name].map((e) => e && e?.status?.message)
          : form.errors[name]?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default DropzoneField;
