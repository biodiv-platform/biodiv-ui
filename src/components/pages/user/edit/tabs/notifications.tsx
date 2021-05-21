import { SubmitButton } from "@components/form/submit-button";
import { SwitchField } from "@components/form/switch";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { axUpdateNotifications } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { UserEditPageComponentProps } from "..";

export default function NotificationsTab({ user }: UserEditPageComponentProps) {
  const { t } = useTranslation();

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object().shape({
        sendNotification: Yup.boolean().required(), // Email
        sendPushNotification: Yup.boolean().required(),
        sendDigest: Yup.boolean().required(),
        hideEmial: Yup.boolean().required(),
        identificationMail: Yup.boolean().required()
      })
    ),
    defaultValues: {
      sendNotification: user.sendNotification,
      sendPushNotification: user.sendPushNotification,
      sendDigest: user.sendDigest,
      hideEmial: user.hideEmial,
      identificationMail: user.identificationMail
    }
  });

  const handleOnUpdate = async (payload) => {
    const { success } = await axUpdateNotifications({ id: user.id, ...payload });
    if (success) {
      notification(t("USER.UPDATED"), NotificationType.Success);
    } else {
      notification(t("USER.UPDATE_ERROR"));
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleOnUpdate)}>
      <SwitchField name="sendPushNotification" label={t("USER.SEND_PUSH_NOTIFICATIONS")} />
      <SwitchField name="sendNotification" label={t("USER.SEND_EMAIL")} />
      <SwitchField name="identificationMail" label={t("USER.IDENTIFICATION_MAIL")} />
      <SwitchField name="hideEmial" label={t("USER.HIDE_EMAIL")} />
      <SwitchField name="sendDigest" label={t("USER.SEND_DIGEST")} />
      <SubmitButton leftIcon={<CheckIcon />}>{t("SAVE")}</SubmitButton>
    </form>
  );
}
