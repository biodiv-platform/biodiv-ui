import {
  FormControl,
  FormErrorMessage,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { TOGGLE_PHOTO_SELECTOR } from "@static/events";
import React, { useEffect, useState } from "react";
import { emit } from "react-gbus";
import { FormContextValues } from "react-hook-form";

import FromURL from "./from-url";
import MyUploads from "./my-uploads";
import ResourcesList from "./observation-resources/resources-list";
import useObservationCreate from "./use-observation-resources";

export interface IDropzoneProps {
  name: string;
  mb?: number;
  form: FormContextValues<any>;
  isCreate?: boolean;
  children?;
}

const DropzoneField = ({ name, mb = 4, form }: IDropzoneProps) => {
  const { observationAssets } = useObservationCreate();
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    form.setValue(name, observationAssets);
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
        <TabList mb={4}>
          <Tab>{t("OBSERVATION.SELECTED_MEDIA")}</Tab>
          <Tab>{t("OBSERVATION.MY_UPLOADS")}</Tab>
          <Tab>{t("OBSERVATION.FROM_URL")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ResourcesList />
          </TabPanel>
          <TabPanel>
            <MyUploads onDone={onSelectionDone} />
          </TabPanel>
          <TabPanel>
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
