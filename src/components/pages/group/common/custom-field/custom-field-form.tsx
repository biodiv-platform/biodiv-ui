import { Box, Button, SimpleGrid } from "@chakra-ui/core";
import CheckBoxField from "@components/form/checkbox";
import Select from "@components/form/select";
import SelectCreatable from "@components/form/select-creatable";
import SubmitButton from "@components/form/submit-button";
import TextBox from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import { yupResolver } from "@hookform/resolvers";
import useGlobalState from "@hooks/useGlobalState";
import { axAddCustomField, axAddExsistingCustomField } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import ImageUploaderField from "../image-uploader-field";
import { DATA_TYPE, DEFAULT_CUSTOMFIELD_VALUE, FIELD_TYPE } from "../static";
import OptionsField from "./options-field";

export default function AddCustomField({
  setCustomFields,
  allCustomFields,
  customFields,
  setIsCreate
}) {
  const { t } = useTranslation();
  const [showOption, setShowOption] = useState<boolean>();
  const [fieldTypes, setFilterTypes] = useState(FIELD_TYPE);
  const [dataTypes, setDataTypes] = useState(DATA_TYPE);
  const [defaultValues, setDefaultValue] = useState(DEFAULT_CUSTOMFIELD_VALUE);
  const [customFieldExist, setCustomFieldExist] = useState<boolean>();

  const categoricalType = ["SINGLE CATEGORICAL", "MULTIPLE CATEGORICAL"];
  const {
    currentGroup: { id: userGroupId }
  } = useGlobalState();

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
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
                value: Yup.string().nullable(),
                iconURL: Yup.string().nullable(),
                notes: Yup.string().nullable()
              })
            );
          }
          return Yup.mixed().notRequired();
        })
      })
    ),
    defaultValues
  });

  const handleFormSubmit = async (value) => {
    if (customFields.some((o) => o?.customFields?.name === value.name)) {
      notification(t("GROUP.CUSTOM_FIELD.EXIST"));
      return;
    }

    const { isMandatory, allowedParticipation } = value;

    const addExistPayload = [
      {
        customFieldId: defaultValues["id"],
        displayOrder: customFields.length + 1,
        isMandatory,
        allowedParticipation
      }
    ];

    const createPayload = {
      ...value,
      userGroupId,
      displayOrder: customFields.length + 1
    };

    const { success, data } = customFieldExist
      ? await axAddExsistingCustomField(userGroupId, addExistPayload)
      : await axAddCustomField(createPayload);

    if (success) {
      notification(t("GROUP.CUSTOM_FIELD.ADD.SUCCESS"), NotificationType.Success);
      setCustomFields(data);
      setIsCreate(false);
    } else {
      notification(t("GROUP.CUSTOM_FIELD.ADD.FAILURE"));
    }
  };

  const handleFieldChange = (value) => {
    setShowOption(categoricalType.includes(value));
    let newValue;
    switch (value) {
      case "RANGE":
        newValue = DATA_TYPE.filter((item) => item.value !== "STRING");
        break;
      case "SINGLE CATEGORICAL":
      case "MULTIPLE CATEGORICAL":
        newValue = DATA_TYPE.filter((item) => item.value === "STRING");
        break;
      default:
        newValue = DATA_TYPE.filter((item) => item.value !== "DATE");
        break;
    }
    setDataTypes(newValue);
  };

  const handleDataTypeChange = (value) => {
    let newValue;
    switch (value) {
      case "DATE":
        newValue = FIELD_TYPE.filter((item) => item.value === "RANGE");
        break;
      case "INTEGER":
      case "DECIMAL":
        newValue = FIELD_TYPE.filter((item) => !categoricalType.includes(item.value));
        break;
      default:
        newValue = FIELD_TYPE.filter((item) => item.value !== "RANGE");
        break;
    }
    setFilterTypes(newValue);
  };

  const handleCustomFieldName = (name) => {
    const defaultValue = allCustomFields.reduce((acc, item) => {
      if (item.customFields.name === name) {
        const { customFields, cfValues, allowedParticipation, isMandatory, ...others } = item;
        acc = {
          ...customFields,
          allowedParticipation: allowedParticipation || true,
          isMandatory: isMandatory || true,
          values: cfValues ? [...cfValues.map((i) => ({ value: i.values, ...i }))] : [],
          ...others
        };
      }
      return acc;
    }, DEFAULT_CUSTOMFIELD_VALUE);
    setDefaultValue(defaultValue);
    setCustomFieldExist(Object.prototype.hasOwnProperty.call(defaultValue, "id"));
  };

  useEffect(() => {
    hForm.reset(defaultValues);
    setShowOption(categoricalType.includes(defaultValues["fieldType"]));
  }, [defaultValues]);

  return (
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
      <Button mb={4} type="button" onClick={() => setIsCreate(false)} leftIcon="arrow-back">
        {t("GROUP.CUSTOM_FIELD.BACK")}
      </Button>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }}>
        <Box gridColumn="1/4">
          <SelectCreatable
            onChangeCallback={handleCustomFieldName}
            name="name"
            form={hForm}
            options={allCustomFields.map((i) => ({
              label: i.customFields.name,
              value: i.customFields.name
            }))}
            label={t("GROUP.CUSTOM_FIELD.NAME")}
          />
          <TextAreaField
            name="notes"
            disabled={customFieldExist}
            form={hForm}
            label={t("GROUP.CUSTOM_FIELD.NOTES")}
          />
        </Box>
        <ImageUploaderField nestedPath="customField" label="icon" name="iconURL" form={hForm} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacingX={4}>
        <TextBox
          name="units"
          disabled={customFieldExist}
          form={hForm}
          label={t("GROUP.CUSTOM_FIELD.UNITS")}
        />
        <Select
          name="fieldType"
          options={fieldTypes}
          disabled={customFieldExist}
          form={hForm}
          isControlled={true}
          onChangeCallback={handleFieldChange}
          label={t("GROUP.CUSTOM_FIELD.FIELD_TYPE")}
        />
        <Select
          name="dataType"
          disabled={customFieldExist}
          onChangeCallback={handleDataTypeChange}
          options={dataTypes}
          form={hForm}
          isControlled={true}
          label={t("GROUP.CUSTOM_FIELD.DATA_TYPE")}
        />
      </SimpleGrid>
      {showOption && (
        <OptionsField
          disabled={customFieldExist}
          radioGroupName="defaultValue"
          name="values"
          form={hForm}
        />
      )}
      <CheckBoxField name="isMandatory" form={hForm} label={t("GROUP.CUSTOM_FIELD.IS_MANDATORY")} />
      <CheckBoxField
        name="allowedParticipation"
        form={hForm}
        label={t("GROUP.CUSTOM_FIELD.ALLOW_PARTICIPANT")}
      />
      <SubmitButton leftIcon="check" form={hForm}>
        {t("GROUP.CUSTOM_FIELD.CREATE")}
      </SubmitButton>
    </form>
  );
}
