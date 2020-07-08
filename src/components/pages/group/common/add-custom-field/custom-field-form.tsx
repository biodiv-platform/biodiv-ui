import { Box, SimpleGrid } from "@chakra-ui/core";
import CheckBoxField from "@components/form/checkbox";
import ControlledSelect from "@components/form/controlled-select";
import SelectCreatable from "@components/form/select-creatable";
import SubmitButton from "@components/form/submit-button";
import TextBox from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import { axAddCustomField, axAddExsistingCustomField } from "@services/customfield.service";
import notification, { NotificationType } from "@utils/notification";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import ImageUploaderField from "../image-uploader-field";
import { dataType, defaultCustomFieldFormValue, fieldType } from "../static";
import OptionsField from "./options-field";

export default function AddCustomField({
  updateCustomFieldList,
  allCustomField,
  existingCustomField
}) {
  const [showOption, setShowOption] = useState<boolean>();
  const [fieldTypes, setFilterTypes] = useState(fieldType);
  const [dataTypes, setDataTypes] = useState(dataType);
  const [defaultValues, setDefaultValue] = useState(defaultCustomFieldFormValue);
  const [customFieldExist, setCustomFieldExist] = useState<boolean>();
  const { t } = useTranslation();

  const categoricalType = ["SINGLE CATEGORICAL", "MULTIPLE CATEGORICAL"];
  const { id } = useStoreState((s) => s.currentGroup);

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
      defaultValue: Yup.string().nullable(),
      values: Yup.lazy((value) => {
        if (value) {
          return Yup.array().of(
            Yup.object().shape({
              value: Yup.string().required(),
              iconURL: Yup.string().nullable(),
              notes: Yup.string().nullable()
            })
          );
        }
        return Yup.mixed().notRequired();
      })
    }),
    defaultValues
  });

  const handleFormSubmit = async (value) => {
    if (existingCustomField.some((o) => o?.customFields?.name === value.name)) {
      notification(t("GROUP.CUSTOM_FIELD.EXIST"));
      return;
    }
    const { isMandatory, allowedParticipation } = value;
    const payload = [
      {
        customFieldId: defaultValues["id"],
        displayOrder: existingCustomField.length + 1,
        isMandatory,
        allowedParticipation
      }
    ];

    const { success, data } = customFieldExist
      ? await axAddExsistingCustomField(id, payload)
      : await axAddCustomField({
          ...value,
          userGroupId: id,
          displayOrder: existingCustomField.length + 1
        });
    if (success) {
      notification(t("GROUP.CUSTOM_FIELD.ADD_SUCCESS"), NotificationType.Success);
      updateCustomFieldList(0, data);
    } else {
      notification(t("GROUP.CUSTOM_FIELD.ADD_FAILURE"));
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
        ? fieldType.filter((item) => !categoricalType.includes(item.value))
        : fieldType.filter((item) => item.value !== "RANGE");
    setFilterTypes(resFilterType);
  };

  const handleCustomFieldName = (name) => {
    const defaultValues = allCustomField.find((item) => item.customFields.name === name);
    if (defaultValues) {
      const { customFields, cfValues, ...others } = defaultValues;
      setDefaultValue({
        ...customFields,
        values: cfValues ? [...cfValues.map((i) => ({ value: i.values, ...i }))] : [],
        ...others
      });
      setCustomFieldExist(true);
    } else {
      setDefaultValue(defaultCustomFieldFormValue);
      setCustomFieldExist(false);
    }
  };

  useEffect(() => {
    hForm.reset(defaultValues);
    categoricalType.includes(defaultValues["fieldType"])
      ? setShowOption(true)
      : setShowOption(false);
  }, [defaultValues]);

  return (
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }}>
        <Box gridColumn="1/4">
          <SelectCreatable
            handleChange={handleCustomFieldName}
            name="name"
            form={hForm}
            options={allCustomField.map((i) => {
              return {
                label: i.customFields.name,
                value: i.customFields.name
              };
            })}
            label={t("GROUP.CUSTOM_FIELD.NAME")}
          />
          <TextAreaField name="notes" form={hForm} label={t("GROUP.CUSTOM_FIELD.NOTES")} />
        </Box>
        <ImageUploaderField nestedPath="customField" label="icon" name="iconURL" form={hForm} />
      </SimpleGrid>
      <TextBox name="units" form={hForm} label={t("GROUP.CUSTOM_FIELD.UNITS")} />
      <ControlledSelect
        name="fieldType"
        options={fieldTypes}
        form={hForm}
        handleChange={handleFieldChange}
        label={t("GROUP.CUSTOM_FIELD.FIELD_TYPE")}
      />
      <ControlledSelect
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
      {showOption && <OptionsField radioGroupName="defaultValue" name="values" form={hForm} />}
      <SubmitButton form={hForm}>{t("GROUP.CUSTOM_FIELD.SAVE")}</SubmitButton>
    </form>
  );
}
