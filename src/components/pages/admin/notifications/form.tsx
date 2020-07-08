import { Flex } from "@chakra-ui/core";
import Submit from "@components/form/submit-button";
import TextBox from "@components/form/text";
import useTranslation from "@configs/i18n/useTranslation";
import { axSendPushNotification } from "@services/user.service";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import notification from "@utils/notification";

function NotificationsForm() {
  const { t } = useTranslation();
  const hForm = useForm({
    validationSchema: Yup.object().shape({
      title: Yup.string().required(),
      body: Yup.string().required(),
      icon: Yup.string()
    })
  });

  const handleOnSubmit = async (v) => {
    const payload = {
      title: v.title,
      body: v.body,
      icon: v.icon
    };

    const { success } = await axSendPushNotification(payload);

    if (success) {
      notification(t("ADMIN.PAGES.NOTIFICATION.FORM.TOKEN_SAVED"));
    } else {
      notification(t("ADMIN.PAGES.NOTIFICATION.FORM.ERROR"));
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
      <TextBox
        name="title"
        type="text"
        label={t("ADMIN.PAGES.NOTIFICATION.FORM.TITLE")}
        form={hForm}
      />
      <TextBox
        name="body"
        type="text"
        label={t("ADMIN.PAGES.NOTIFICATION.FORM.BODY")}
        form={hForm}
      />
      <TextBox
        name="icon"
        type="text"
        label={t("ADMIN.PAGES.NOTIFICATION.FORM.ICON")}
        form={hForm}
      />
      <Flex justifyContent="space-between" alignItems="center">
        <Submit form={hForm} rightIcon="arrow-forward">
          Submit
        </Submit>
      </Flex>
    </form>
  );
}

export default NotificationsForm;
