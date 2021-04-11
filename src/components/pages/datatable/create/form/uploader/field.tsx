import {
  FormControl,
  FormErrorMessage,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import { TOGGLE_PHOTO_SELECTOR } from "@static/events";
import React, { useEffect, useState } from "react";
import { emit } from "react-gbus";
import { UseFormMethods } from "react-hook-form";

import MyUploads from "@components/pages/observation/create/form/uploader/my-uploads";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import ImageUploaderField from "./file-uploader-field";

export interface IDropzoneProps {
  name: string;
  setFieldMapping:any;
  mb?: number;
  form: UseFormMethods<Record<string, any>>;
  isCreate?: boolean;
  children?;
}

const DropzoneField = ({ name, mb = 4, form ,setFieldMapping}: IDropzoneProps) => {
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
      <Tabs index={tabIndex} onChange={setTabIndex} variant="soft-rounded" isLazy={true}>
        <TabList mb={4} overflowX="auto" py={1}>
          <Tab>✔️ {t("OBSERVATION.SELECTED_MEDIA")}</Tab>
          <Tab>☁️ {t("OBSERVATION.MY_UPLOADS")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <ImageUploaderField
              simpleUpload={true}
              label={t("Sheet Uploader")}
              setFieldMapping={setFieldMapping}
              name={name}
              form={form}
              mb={0}
            />
          </TabPanel>
          <TabPanel p={0}>
            <MyUploads onDone={onSelectionDone} />
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
