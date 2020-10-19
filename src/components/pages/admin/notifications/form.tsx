import { Flex } from "@chakra-ui/core";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import Submit from "@components/form/submit-button";
import TextBox from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import { axSendPushNotification } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

function NotificationsForm() {
  const { t } = useTranslation();

  const hForm = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required(),
        body: Yup.string().required(),
        icon: Yup.string(),
        clickAction: Yup.string()
      })
    )
  });

  const handleOnSubmit = async (payload) => {
    const { success } = await axSendPushNotification(payload);

    if (success) {
      notification(t("ADMIN.PAGES.NOTIFICATION.FORM.SUCCESS"), NotificationType.Success);
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
      <TextBox
        name="clickAction"
        type="text"
        label={t("ADMIN.PAGES.NOTIFICATION.FORM.LINK")}
        form={hForm}
      />
      <Flex justifyContent="space-between" alignItems="center">
        <Submit form={hForm} rightIcon={<ArrowForwardIcon />}>
          Submit
        </Submit>
      </Flex>
    </form>
  );
}

export default NotificationsForm;
