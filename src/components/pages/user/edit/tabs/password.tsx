import { SimpleGrid } from "@chakra-ui/react";
import SubmitButton from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { Role } from "@interfaces/custom";
import { axUpdateUserPassword } from "@services/user.service";
import { hasAccess } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
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
            hidden={hideOldPassword}
            label={t("USER.CURRENT_PASSWORD")}
            form={hForm}
          />
          <TextBoxField
            name="newPassword"
            type="password"
            label={t("USER.NEW_PASSWORD")}
            form={hForm}
          />
          <TextBoxField
            name="confirmNewPassword"
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
