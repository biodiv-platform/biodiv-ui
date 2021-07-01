import {
  FormControl,
  FormErrorMessage,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import MyUploads from "@components/pages/observation/create/form/uploader/my-uploads";
import ResourcesList from "@components/pages/observation/create/form/uploader/observation-resources/resources-list";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";

export interface IDropzoneProps {
  name: string;
  mb?: number;
  isCreate?: boolean;
  children?;
}

const DropzoneField = ({ name, mb = 4 }: IDropzoneProps) => {
  const { field, fieldState } = useController({ name });
  const { observationAssets } = useObservationCreate();
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    field.onChange(observationAssets);
  }, [observationAssets]);

  const onSelectionDone = () => setTabIndex(0);

  return (
    <FormControl isInvalid={fieldState.invalid} mb={mb}>
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
      <FormErrorMessage children={JSON.stringify(fieldState?.error?.message)} />
    </FormControl>
  );
};

export default DropzoneField;
