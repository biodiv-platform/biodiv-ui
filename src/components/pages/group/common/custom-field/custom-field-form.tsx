import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, GridItem, SimpleGrid } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SelectCreatableInputField } from "@components/form/select-creatable";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axAddCustomField, axAddExsistingCustomField } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import ImageUploaderField from "../image-uploader-field";
import { DATA_TYPE, DEFAULT_CUSTOMFIELD_VALUE, FIELD_TYPE } from "../static";
import { customFieldValidationSchema } from "./common";
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
    resolver: yupResolver(customFieldValidationSchema),
    defaultValues
  });

  const handleFormSubmit = async (value) => {
    if (customFields.some((o) => o?.customFields?.name === value.name)) {
      notification(t("group:custom_field.exist"));
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
      notification(t("group:custom_field.add.success"), NotificationType.Success);
      setCustomFields(data);
      setIsCreate(false);
    } else {
      notification(t("group:custom_field.add.failure"));
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
        const { customFields: cfs, cfValues, allowedParticipation, isMandatory, ...others } = item;
        acc = {
          ...cfs,
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
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
        <Button
          mb={4}
          type="button"
          onClick={() => setIsCreate(false)}
          leftIcon={<ArrowBackIcon />}
        >
          {t("group:custom_field.back")}
        </Button>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }}>
          <GridItem colSpan={3}>
            <SelectCreatableInputField
              onChangeCallback={handleCustomFieldName}
              name="name"
              options={allCustomFields.map((i) => ({
                label: i.customFields.name,
                value: i.customFields.name
              }))}
              label={t("group:custom_field.name")}
            />
            <TextAreaField name="notes" disabled={customFieldExist} label={t("form:notes")} />
          </GridItem>
          <ImageUploaderField
            nestedPath="customField"
            disabled={customFieldExist}
            label={t("group:custom_field.icon")}
            name="iconURL"
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacingX={4}>
          <TextBoxField
            name="units"
            disabled={customFieldExist}
            label={t("group:custom_field.units")}
          />
          <SelectInputField
            name="fieldType"
            options={fieldTypes}
            disabled={customFieldExist}
            isControlled={true}
            onChangeCallback={handleFieldChange}
            label={t("group:custom_field.field_type")}
          />
          <SelectInputField
            name="dataType"
            disabled={customFieldExist}
            onChangeCallback={handleDataTypeChange}
            options={dataTypes}
            isControlled={true}
            label={t("group:custom_field.data_type")}
          />
        </SimpleGrid>
        {showOption && (
          <OptionsField
            disabled={customFieldExist}
            radioGroupName="defaultValue"
            name="values"
            isEdit={false}
          />
        )}
        <CheckboxField name="isMandatory" label={t("group:custom_field.is_mandatory")} />
        <CheckboxField
          name="allowedParticipation"
          label={t("group:custom_field.allow_participant")}
        />
        <SubmitButton leftIcon={<CheckIcon />}>{t("group:custom_field.create")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
