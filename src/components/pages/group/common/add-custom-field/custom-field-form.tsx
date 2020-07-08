import { Box, SimpleGrid } from "@chakra-ui/core";
import CheckBoxField from "@components/form/checkbox";
import SelectInputField from "@components/form/select";
import SubmitButton from "@components/form/submit-button";
import TextBox from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import ImageUploaderField from "../image-uploader-field";
import { dataType, fieldType } from "../static";
import OptionsField from "./options-field";

export default function AddCustomField() {
  const { t } = useTranslation();
  const [showOption, setShowOption] = useState<boolean>();
  const [fieldTypes, setFilterTypes] = useState(fieldType);
  const [dataTypes, setDataTypes] = useState(dataType);
  const categoricalType = ["singleCategorical", "multipleCategorical"];
  // const router = useLocalRouter();
  const hForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      notes: Yup.string().nullable(),
      allowedParticipation: Yup.boolean().required(),
      isMandatory: Yup.boolean().required(),
      displayOrder: Yup.number().nullable(),
      iconURL: Yup.string().nullable(),
      dataType: Yup.string().required(),
      fieldType: Yup.string().required(),
      optionalObject: Yup.lazy((value) => {
        if (value) {
          return Yup.array().of(
            Yup.object().shape({
              value: Yup.string().required(),
              iconURL: Yup.string(),
              notes: Yup.string().nullable(),
              isDefault: Yup.boolean().nullable()
            })
          );
        }
        return Yup.mixed().notRequired();
      })
    }),
    defaultValues: {
      allowedParticipation: true,
      isMandatory: true,
      optionalObject: [{ name: "val1" }, { name: "val2" }]
    }
  });
  const handleFormSubmit = async () => {
    // console.log("the value data is", value);
  };

  const handleFieldChange = (value) => {
    categoricalType.includes(value) ? setShowOption(true) : setShowOption(false);

    const resDataType =
      value === "range"
        ? dataType.filter((item) => item.value !== "text")
        : dataType.filter((item) => item.value !== "date");
    setDataTypes(resDataType);
  };

  const handleDataTypeChange = (value) => {
    const resFilterType =
      value === "date"
        ? fieldType.filter((item) => item.value === "range")
        : fieldType.filter((item) => item.value !== "range");
    setFilterTypes(resFilterType);
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }}>
        <Box gridColumn="1/4">
          <TextBox
            name="name"
            form={hForm}
            label={t("GROUP.CUSTOM_FIELD.NAME")}
            isRequired={true}
          />
          <TextAreaField name="notes" form={hForm} label={t("GROUP.CUSTOM_FIELD.NOTES")} />
        </Box>
        <ImageUploaderField label="icon" name="iconURL" form={hForm} />
      </SimpleGrid>
      <SelectInputField
        name="fieldType"
        options={fieldTypes}
        form={hForm}
        handleChange={handleFieldChange}
        label={t("GROUP.CUSTOM_FIELD.FIELD_TYPE")}
      />
      <SelectInputField
        name="dataType"
        handleChange={handleDataTypeChange}
        options={dataTypes}
        form={hForm}
        label={t("GROUP.CUSTOM_FIELD.DATA_TYPE")}
      />
      <CheckBoxField name="isMandatory" form={hForm} label={t("GROUP.CUSTOM_FIELD.IS_MANDATORY")} />
      <CheckBoxField
        name="allowedParticipation"
        form={hForm}
        label={t("GROUP.CUSTOM_FIELD.ALLOW_PARTICIPANT")}
      />
      {showOption && <OptionsField form={hForm} />}
      <SubmitButton form={hForm}>{t("GROUP.CUSTOM_FIELD.SAVE")}</SubmitButton>
    </form>
  );
}
