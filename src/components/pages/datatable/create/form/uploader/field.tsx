import { Box, FormErrorMessage, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import MyUploads from "@components/pages/observation/create/form/uploader/my-uploads";
import useTranslation from "@hooks/use-translation";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import FieldMappingInput from "../uploader/file-uploader-field/options-field";
import SheetUploader from "./file-uploader-field";

export interface IDropzoneProps {
  name: string;
  showMapping: boolean;
  setFieldMapping: any;
  setShowMapping: any;
  fieldMapping: any;
  mb?: number;
  isCreate?: boolean;
  children?;
}

const DropzoneField = ({
  name,
  mb = 4,
  setFieldMapping,
  showMapping,
  fieldMapping,
  setShowMapping
}: IDropzoneProps) => {
  const form = useFormContext();
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    form.register(name);
  }, [form.register]);

  const onSelectionDone = () => setTabIndex(0);

  return (
    <ToggleablePanel icon="📂" title={t("DATATABLE.FILES_UPLOAD")}>
      <Box p={4} pb={0}>
        <Box mb={mb}>
          <Tabs className="nospace" index={tabIndex} onChange={setTabIndex} variant="soft-rounded">
            <TabList mb={2}>
              <Tab>📝 {t("DATATABLE.SHEET_UPLOADER")}</Tab>
              <Tab>☁️ {t("DATATABLE.MEDIA_UPLOADER")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {showMapping ? (
                  <FieldMappingInput
                    fieldMapping={fieldMapping}
                    showMapping={showMapping}
                    setShowMapping={setShowMapping}
                    name="columnsMapping"
                  />
                ) : (
                  <SheetUploader
                    simpleUpload={true}
                    label={t("DATATABLE.SHEET_UPLOADER")}
                    setFieldMapping={setFieldMapping}
                    setShowMapping={setShowMapping}
                    isRequired={true}
                    name={name}
                    mb={0}
                  />
                )}
              </TabPanel>
              <TabPanel>
                <MyUploads onDone={onSelectionDone} hasTabs={false} />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <FormErrorMessage children={form?.formState?.errors?.[name]} />
        </Box>
      </Box>
    </ToggleablePanel>
  );
};

export default DropzoneField;
