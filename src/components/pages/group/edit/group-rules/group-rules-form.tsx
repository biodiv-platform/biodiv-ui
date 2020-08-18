import { Button } from "@chakra-ui/core";
import SelectField from "@components/form/select";
import SubmitButton from "@components/form/submit-button";
import useTranslation from "@configs/i18n/useTranslation";
import { yupResolver } from "@hookform/resolvers";
import { axAddUserGroupRule } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import { formatGroupRules } from "@utils/userGroup";
import { useStoreState } from "easy-peasy";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { RULES_TYPE } from "../../common/static";
import RulesInputType from "./rules-input-type";

export default function AddGroupRules({ groupRules, setCustomFields, setIsCreate }) {
  const { t } = useTranslation();

  const { id: userGroupId } = useStoreState((s) => s.currentGroup);
  const [inputType, setInputType] = useState<string>();

  const hForm = useForm({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        type: Yup.string().required(),
        ruleValue: Yup.mixed().when("type", {
          is: (type) =>
            ["observedOnDateList", "taxonomicIdList", "createdOnDateList"].includes(type),
          then: Yup.array().min(1),
          otherwise: Yup.mixed().required()
        })
      })
    )
  });

  const formatPayload = (formData) => {
    const { type, ruleValue } = formData;
    switch (formData.type) {
      case "hasUserRule":
        return { [`${type}`]: ruleValue };
      case "spartialDataList":
        return { [`${type}`]: [ruleValue] };
      case "observedOnDateList":
      case "createdOnDateList":
        return { [`${type}`]: [{ fromDate: ruleValue[0], toDate: ruleValue[1] }] };
      case "taxonomicIdList":
        return { [`${type}`]: ruleValue?.map((o) => o.id) };
    }
  };

  const handleFormSubmit = async (formData) => {
    const payload = formatPayload(formData);
    const { success, data } = await axAddUserGroupRule(userGroupId, payload);
    if (success && groupRules) {
      notification(t("GROUP.RULES.ADD.SUCCESS"), NotificationType.Success);
      setCustomFields(formatGroupRules(data));
      setIsCreate(false);
    } else {
      notification(t("GROUP.RULES.ADD.FAILURE"));
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
      <Button mb={4} type="button" onClick={() => setIsCreate(false)} leftIcon="arrow-back">
        {t("GROUP.CUSTOM_FIELD.BACK")}
      </Button>
      <SelectField
        name="type"
        onChangeCallback={setInputType}
        options={RULES_TYPE}
        label={t("GROUP.RULES.INPUT_TYPES.TITLE")}
        form={hForm}
      />
      {inputType && <RulesInputType inputType={inputType} form={hForm} name="ruleValue" />}
      <SubmitButton leftIcon="check" form={hForm}>
        {t("GROUP.RULES.ADD.TITLE")}
      </SubmitButton>
    </form>
  );
}
