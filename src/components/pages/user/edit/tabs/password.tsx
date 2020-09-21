import { SimpleGrid } from "@chakra-ui/core";
import SubmitButton from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import { yupResolver } from "@hookform/resolvers";
import CheckIcon from "@icons/check";
import { axUpdateUserPassword } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export default function ChangePasswordTab({ userId }) {
  const { t } = useTranslation();

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object().shape({
        oldPassword: Yup.string().required(),
        password: Yup.string().min(8).required(),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords do not match")
          .required()
      })
    )
  });

  const handleOnUpdate = async (payload) => {
    const { success } = await axUpdateUserPassword({ id: userId, ...payload });
    if (success) {
      notification(t("FORGOT_PASSWORD.RESET_SUCCESS"), NotificationType.Success);
    } else {
      notification(t("FORGOT_PASSWORD.RESET_ERROR"));
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleOnUpdate)}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4}>
        <div>
          <TextBoxField
            name="oldPassword"
            type="password"
            label={t("USER.CURRENT_PASSWORD")}
            form={hForm}
          />
          <TextBoxField
            name="password"
            type="password"
            label={t("USER.NEW_PASSWORD")}
            form={hForm}
          />
          <TextBoxField
            name="confirmPassword"
            type="password"
            label={t("USER.CONFIRM_NEW_PASSWORD")}
            form={hForm}
          />
        </div>
      </SimpleGrid>
      <SubmitButton leftIcon={<CheckIcon />} form={hForm}>
        {t("USER.UPDATE_PASSWORD")}
      </SubmitButton>
    </form>
  );
}
