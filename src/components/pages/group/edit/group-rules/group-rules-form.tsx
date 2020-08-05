import { Button } from "@chakra-ui/core";
import SubmitButton from "@components/form/submit-button";
import useTranslation from "@configs/i18n/useTranslation";
import { axAddExsistingCustomField } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import TextField from "@components/form/text";
import SelectField from "@components/form/select";
import { useStoreState } from "easy-peasy";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import RulesInputType from "./rules-input-type";
import { RULES_TYPE } from "../../common/static";
import * as Yup from "yup";

export default function AddCustomField({ groupRules, setCustomFields, setIsCreate }) {
  const { t } = useTranslation();

  const { id } = useStoreState((s) => s.currentGroup);
  const [inputType, setInputType] = useState<string>();

  const hForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      type: Yup.string().required(),
      value: Yup.string().required()
    })
  });

  const handleFormSubmit = async (value) => {
    const { success, data } = await axAddExsistingCustomField(id, value);
    if (success && groupRules) {
      notification(t("GROUP.CUSTOM_FIELD.ADD.SUCCESS"), NotificationType.Success);
      setCustomFields(data);
      setIsCreate(false);
    } else {
      notification(t("GROUP.CUSTOM_FIELD.ADD.FAILURE"));
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
      <Button mb={4} type="button" onClick={() => setIsCreate(false)} leftIcon="arrow-back">
        {t("GROUP.CUSTOM_FIELD.BACK")}
      </Button>
      <TextField name="name" label={t("Name")} form={hForm} />
      <SelectField
        name="type"
        onChange={setInputType}
        options={RULES_TYPE}
        label={t("Rule Type")}
        form={hForm}
      />
      {inputType && (
        <RulesInputType inputType={inputType} form={hForm} name="value" label={t("Rules")} />
      )}
      <SubmitButton leftIcon="check" form={hForm}>
        {t("GROUP.CUSTOM_FIELD.CREATE")}
      </SubmitButton>
    </form>
  );
}
