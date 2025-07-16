import { Box, Tabs } from "@chakra-ui/react";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import MyUploads from "@components/pages/observation/create/form/uploader/my-uploads";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Field } from "@/components/ui/field";

import FieldMappingInput from "../uploader/file-uploader-field/options-field";
import SheetUploader from "./file-uploader-field";

export interface IDropzoneProps {
  name: string;
  showMapping: boolean;
  setFieldMapping: any;
  observationConfig: any;
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
  observationConfig,
  setShowMapping
}: IDropzoneProps) => {
  const form = useFormContext();
  const [tab, setTab] = useState("datatable:sheet_uploader");
  const { t } = useTranslation();

  useEffect(() => {
    form.register(name);
  }, [form.register]);

  const onSelectionDone = () => setTab("datatable:sheet_uploader");

  return (
    <ToggleablePanel icon="📂" title={t("datatable:files_upload")}>
      <Box p={4} pb={0}>
        <Box mb={mb}>
          <Tabs.Root className="nospace" defaultValue={tab} onValueChange={(e) => setTab(e.value)}>
            <Tabs.List mb={2}>
              <Tabs.Trigger value="datatable:sheet_uploader">
                📝 {t("datatable:sheet_uploader")}
              </Tabs.Trigger>
              <Tabs.Trigger value="datatable:media_uploader">
                ☁️ {t("datatable:media_uploader")}
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="datatable:sheet_uploader">
              {showMapping ? (
                <FieldMappingInput
                  observationConfig={observationConfig}
                  fieldMapping={fieldMapping}
                  showMapping={showMapping}
                  setShowMapping={setShowMapping}
                  name="columnsMapping"
                />
              ) : (
                <SheetUploader
                  simpleUpload={true}
                  label={t("datatable:sheet_uploader")}
                  setFieldMapping={setFieldMapping}
                  setShowMapping={setShowMapping}
                  isRequired={true}
                  name={name}
                  mb={0}
                />
              )}
            </Tabs.Content>
            <Tabs.Content value="datatable:media_uploader">
              <MyUploads onDone={onSelectionDone} hasTabs={false} />
            </Tabs.Content>
          </Tabs.Root>
          <Field errorText={form?.formState?.errors?.[name]?.message?.toString()} />
        </Box>
      </Box>
    </ToggleablePanel>
  );
};

export default DropzoneField;
