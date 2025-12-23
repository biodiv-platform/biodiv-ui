import { SimpleGrid } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { Role } from "@interfaces/custom";
import { axUpdateUserPassword } from "@services/user.service";
import { hasAccess } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function ChangePasswordTab({ userId }) {
  const { t } = useTranslation();
  const { user } = useGlobalState();
  const hideOldPassword = useMemo(() => user.id !== userId && hasAccess([Role.Admin]), []);

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object().shape({
        oldPassword: hideOldPassword ? Yup.string().notRequired() : Yup.string().required(),
        newPassword: Yup.string().min(8).required(),
        confirmNewPassword: Yup.string()
          .oneOf([Yup.ref("newPassword"), null], "Passwords do not match")
          .required()
      })
    )
  });

  const handleOnUpdate = async (payload) => {
    const { success } = await axUpdateUserPassword({ id: userId, ...payload });
    if (success) {
      notification(t("auth:forgot.reset_success"), NotificationType.Success);
    } else {
      notification(t("auth:forgot.reset_error"));
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnUpdate)}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gapX={4}>
          <div>
            <TextBoxField
              name="oldPassword"
              type="password"
              autoComplete="current-password"
              hidden={hideOldPassword}
              label={t("user:current_password")}
            />
            <TextBoxField name="newPassword" type="password" autoComplete="new-password" label={t("user:new_password")} />
            <TextBoxField
              name="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              label={t("user:confirm_new_password")}
            />
          </div>
        </SimpleGrid>
        <SubmitButton leftIcon={<CheckIcon />}>{t("user:update_password")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
