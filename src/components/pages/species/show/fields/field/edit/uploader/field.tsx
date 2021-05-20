import { FormControl, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { ErrorMessageMulti } from "@components/form/common/error-message";
import MyUploads from "@components/pages/observation/create/form/uploader/my-uploads";
import ResourcesList from "@components/pages/observation/create/form/uploader/observation-resources/resources-list";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import useTranslation from "@hooks/use-translation";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

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

  const onSelectionDone = () => setTabIndex(0);

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb}>
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
        </TabList>
        <TabPanels>
          <TabPanel>
            <ResourcesList showHint={true} />
          </TabPanel>
          <TabPanel>
            <MyUploads onDone={onSelectionDone} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <ErrorMessageMulti errors={form.errors} name={name} />
    </FormControl>
  );
};

export default DropzoneField;
