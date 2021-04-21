import { Box, FormControl } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import { TOGGLE_PHOTO_SELECTOR } from "@static/events";
import React, { useEffect, useState } from "react";
import { emit } from "react-gbus";
import { UseFormMethods } from "react-hook-form";

import MyUploads from "@components/pages/observation/create/form/uploader/my-uploads";
import ImageUploaderField from "./file-uploader-field";
import BoxHeading from "@components/@core/layout/box-heading";

export interface IDropzoneProps {
  name: string;
  showMapping: boolean;
  setFieldMapping: any;
  setShowMapping: any;
  mb?: number;
  form: UseFormMethods<Record<string, any>>;
  isCreate?: boolean;
  children?;
}

const DropzoneField = ({
  name,
  mb = 4,
  form,
  setFieldMapping,
  showMapping,
  setShowMapping
}: IDropzoneProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  useEffect(() => {
    emit(TOGGLE_PHOTO_SELECTOR, tabIndex !== 0);
  }, [tabIndex, showMapping]);

  const onSelectionDone = () => setTabIndex(0);

  return (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}> 📂 {t("Files Uploader")}</BoxHeading>
      <FormControl isInvalid={form.errors[name] && true} mb={mb}>
        <MyUploads onDone={onSelectionDone} />
        {!showMapping && (
          <ImageUploaderField
            simpleUpload={true}
            label={t("Sheet Uploader")}
            setFieldMapping={setFieldMapping}
            setShowMapping={setShowMapping}
            isRequired={true}
            name={name}
            form={form}
            mb={0}
          />
        )}
      </FormControl>
    </Box>
  );
};

export default DropzoneField;
