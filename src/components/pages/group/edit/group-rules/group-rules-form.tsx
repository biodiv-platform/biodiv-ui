import { Button } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axAddUserGroupRule } from "@services/usergroup.service";
import dayjs, { dateToUTC, parseDate } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuMoveRight } from "react-icons/lu";
import * as Yup from "yup";

import { RULES_TYPE } from "../../common/static";
import RulesInputType from "./rules-input-type";
import { formatGroupRules } from "./utils";

export default function AddGroupRules({ groupRules, setGroupRules, setIsCreate, traits }) {
  const { t } = useTranslation();

  const {
    currentGroup: { id: userGroupId }
  } = useGlobalState();
  const [inputType, setInputType] = useState<string>();

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        type: Yup.string().required(),
        ruleValue: Yup.mixed().when("type", {
          is: (type) =>
            ["observedOnDateList", "taxonomicIdList", "createdOnDateList"].includes(type),
          then: Yup.array().min(1),
          otherwise: Yup.mixed().when("type", {
            is: "traitList",
            then: Yup.array()
              .of(
                Yup.object().shape({
                  trait: Yup.string().required("Trait is required"), // Ensuring trait is a required string
                  value: Yup.mixed().required("Value is required") // Value must be present
                })
              )
              .min(1, "At least one trait is required"),
            otherwise: Yup.mixed().required()
          })
        })
      })
    )
  });

  const formatPayload = (formData) => {
    const { type, ruleValue } = formData;
    switch (formData.type) {
      case "hasUserRule":
        return { [`${type}`]: ruleValue || false };
      case "spartialDataList":
        return { [`${type}`]: [ruleValue] };
      case "observedOnDateList":
      case "createdOnDateList":
        return {
          [`${type}`]: [
            {
              fromDate: dateToUTC(ruleValue[0]).format(),
              toDate: dateToUTC(dayjs(parseDate(ruleValue[1])).endOf("day")).format()
            }
          ]
        };
      case "taxonomicIdList":
        return { [`${type}`]: ruleValue?.map((o) => o.id) };
      case "traitList":
        return {
          [`${type}`]: ruleValue.flatMap(({ trait, value }) => {
            const traitId = trait.split("|")[0];
            return value.map((v) => ({ [traitId]: v.split("|")[0] }));
          })
        };
    }
  };

  const handleFormSubmit = async (formData) => {
    if (userGroupId != null) {
      const payload = formatPayload(formData);
      const { success, data } = await axAddUserGroupRule(userGroupId, payload);
      if (success && groupRules) {
        notification(t("group:rules.add.success"), NotificationType.Success);
        setGroupRules(formatGroupRules(data, traits));
        setIsCreate(false);
      } else {
        notification(t("group:rules.add.failure"));
      }
    } else {
      if (formData.type == "hasUserRule") {
        groupRules.push({ name: "userRule", value: (formData.ruleValue || false).toString() });
        setGroupRules(groupRules);
        setIsCreate(false);
      } else if (formData.type == "taxonomicIdList") {
        formData.ruleValue?.map((o) =>
          groupRules.push({ id: null, name: "taxonomicRule", value: o.id })
        );
        setGroupRules(groupRules);
        setIsCreate(false);
      } else if (formData.type == "observedOnDateList" || formData.type == "createdOnDateList") {
        groupRules.push({
          id: null,
          name: formData.type == "createdOnDateList" ? "createdOnDateRule" : "observedOnDateRule",
          value: `${formData.ruleValue[0]} to ${formData.ruleValue[1]}`
        });
        setGroupRules(groupRules);
        setIsCreate(false);
      } else if (formData.type == "traitList") {
        formData.ruleValue.flatMap(({ trait, value }) => {
          value.map((v) =>
            groupRules.push({
              id: null,
              name: "traitRule",
              value: `${trait} : ${v}`
            })
          );
        });
        setGroupRules(groupRules);
        setIsCreate(false);
      } else {
        groupRules.push({
          id: null,
          name: "spatialRule",
          value: formData.ruleValue
        });
        setGroupRules(groupRules);
        setIsCreate(false);
      }
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
        <Button mb={4} type="button" onClick={() => setIsCreate(false)}>
          <LuMoveRight />
          {t("group:custom_field.back")}
        </Button>
        <SelectInputField
          name="type"
          onChangeCallback={setInputType}
          options={RULES_TYPE}
          label={t("group:rules.input_types.title")}
          shouldPortal={true}
        />
        {inputType && <RulesInputType inputType={inputType} name="ruleValue" traits={traits} />}
        <SubmitButton leftIcon={<CheckIcon />}>{t("group:rules.add.title")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
