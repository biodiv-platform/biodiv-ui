import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, GridItem, SimpleGrid } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axcustomFieldEditDetails } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";

import ImageUploaderField from "../image-uploader-field";
import { DATA_TYPE, DEFAULT_CUSTOMFIELD_VALUE, FIELD_TYPE } from "../static";
import { customFieldValidationSchema } from "./common";
import OptionsField from "./options-field";

export default function EditCustomField({ editCustomFieldData, setIsEdit, setCustomFields }) {
  const { t } = useTranslation();
  const [showOption, setShowOption] = useState<boolean>();
  const [fieldTypes] = useState(FIELD_TYPE);
  const [dataTypes] = useState(DATA_TYPE);
  const categoricalType = ["SINGLE CATEGORICAL", "MULTIPLE CATEGORICAL"];

  const {
    currentGroup: { id: userGroupId }
  } = useGlobalState();
  const customFieldId = editCustomFieldData[0].customFields.id;

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(customFieldValidationSchema),
    defaultValues: {
      isMandatory: editCustomFieldData[0].isMandatory,
      allowedParticipation: editCustomFieldData[0].allowedParticipation
    }
  });

  const handleFormSubmit = async (value) => {
    const editPayload = {
      // Not changeable
      defaultValue: defaultValues["defaultValue"],
      displayOrder: defaultValues["displayOrder"],
      userGroupId: userGroupId,
      customFields: {
        id: defaultValues["id"],
        authorId: defaultValues["authorId"],
        dataType: defaultValues["dataType"],
        fieldType: defaultValues["fieldType"],

        // Changeable
        name: value["name"],
        units: value["units"],
        iconURL: value["iconURL"],
        notes: value["notes"]
      },
      cfValues: value["values"],
      isMandatory: value["isMandatory"],
      allowedParticipation: value["allowedParticipation"]
    };

    const { success, data } = await axcustomFieldEditDetails(
      userGroupId,
      customFieldId,
      editPayload
    );

    if (success) {
      notification(t("group:custom_field.update.success"), NotificationType.Success);
      setCustomFields(data);
      setIsEdit(false);
    } else {
      notification(t("group:custom_field.update.failure"));
    }
  };

  const defaultValues = editCustomFieldData.reduce((acc, item) => {
    const { customFields: cfs, cfValues, allowedParticipation, isMandatory, ...others } = item;
    acc = {
      ...cfs,
      allowedParticipation: allowedParticipation,
      isMandatory: isMandatory,
      values: cfValues ? [...cfValues.map((i) => ({ value: i.values, ...i }))] : [],
      ...others
    };
    return acc;
  }, DEFAULT_CUSTOMFIELD_VALUE);

  useEffect(() => {
    hForm.reset(defaultValues);
    setShowOption(categoricalType.includes(defaultValues["fieldType"]));
  }, []);

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
        <Button mb={4} type="button" onClick={() => setIsEdit(false)} leftIcon={<ArrowBackIcon />}>
          {t("group:custom_field.back")}
        </Button>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }}>
          <GridItem colSpan={3}>
            <TextBoxField name="name" label={t("group:custom_field.name")} />
            <TextAreaField name="notes" label={t("form:notes")} />
          </GridItem>
          <ImageUploaderField nestedPath="customField" label="icon" name="iconURL" />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacingX={4}>
          <TextBoxField name="units" disabled={false} label={t("group:custom_field.units")} />
          <SelectInputField
            name="fieldType"
            options={fieldTypes}
            disabled={true}
            isControlled={true}
            label={t("group:custom_field.field_type")}
          />
          <SelectInputField
            name="dataType"
            disabled={true}
            options={dataTypes}
            isControlled={true}
            label={t("group:custom_field.data_type")}
          />
        </SimpleGrid>
        {showOption && (
          <OptionsField
            disabled={false}
            radioGroupName="defaultValue"
            name="values"
            isEdit={true}
          />
        )}

        <CheckboxField name="isMandatory" label={t("group:custom_field.is_mandatory")} />
        <CheckboxField
          name="allowedParticipation"
          label={t("group:custom_field.allow_participant")}
        />

        <SubmitButton leftIcon={<CheckIcon />}>{t("group:custom_field.update.title")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
