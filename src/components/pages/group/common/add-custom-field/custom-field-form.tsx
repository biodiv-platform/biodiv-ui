import { Box, SimpleGrid } from "@chakra-ui/core";
import CheckBoxField from "@components/form/checkbox";
import SelectInputField from "@components/form/select";
import SubmitButton from "@components/form/submit-button";
import TextBox from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useStoreState } from "easy-peasy";
import * as Yup from "yup";

import ImageUploaderField from "../image-uploader-field";
import { dataType, fieldType } from "../static";
import OptionsField from "./options-field";
import { axAddCustomField } from "@services/customfield.service";
import notification, { NotificationType } from "@utils/notification";

export default function AddCustomField({ updateCustomFieldList }) {
  const { t } = useTranslation();
  const [showOption, setShowOption] = useState<boolean>();
  const [fieldTypes, setFilterTypes] = useState(fieldType);
  const [dataTypes, setDataTypes] = useState(dataType);
  const categoricalType = ["SINGLE CATEGORICAL", "MULTIPLE CATEGORICAL"];
  const { id } = useStoreState((s) => s.currentGroup);
  // const router = useLocalRouter();
  const hForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      notes: Yup.string().nullable(),
      units: Yup.string().nullable(),
      allowedParticipation: Yup.boolean().required(),
      isMandatory: Yup.boolean().required(),
      displayOrder: Yup.number().nullable(),
      iconURL: Yup.string().nullable(),
      dataType: Yup.string().required(),
      fieldType: Yup.string().required(),
      values: Yup.lazy((value) => {
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
      values: [{ name: "val1" }, { name: "val2" }]
    }
  });
  const handleFormSubmit = async (value) => {
    const { success, data } = await axAddCustomField({ ...value, userGroupId: id });
    if (success) {
      notification(t("GROUP.EDIT.SUCCESS"), NotificationType.Success);
      updateCustomFieldList(0, data);
    } else {
      notification(t("GROUP.EDIT.ERROR"));
    }
  };

  const handleFieldChange = (value) => {
    setShowOption(categoricalType.includes(value));

    const resDataType =
      value === "RANGE"
        ? dataType.filter((item) => item.value !== "STRING")
        : categoricalType.includes(value)
        ? dataType.filter((item) => item.value === "STRING")
        : dataType.filter((item) => item.value !== "DATE");
    setDataTypes(resDataType);
  };

  const handleDataTypeChange = (value) => {
    const resFilterType =
      value === "DATE"
        ? fieldType.filter((item) => item.value === "RANGE")
        : value === "INTEGER" || value === "DECIMAL"
        ? fieldType.filter(
            (item) => !["SINGLE CATEGORICAL", "MULTIPLE CATEGORICAL"].includes(item.value)
          )
        : fieldType.filter((item) => item.value !== "RANGE");
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
        <ImageUploaderField nestedPath="customField" label="icon" name="iconURL" form={hForm} />
      </SimpleGrid>
      <TextBox name="units" form={hForm} label={t("GROUP.CUSTOM_FIELD.UNITS")} />
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
      {showOption && <OptionsField name="values" form={hForm} />}
      <SubmitButton form={hForm}>{t("GROUP.CUSTOM_FIELD.SAVE")}</SubmitButton>
    </form>
  );
}
