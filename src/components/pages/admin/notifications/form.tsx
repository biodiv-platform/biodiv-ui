import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import { axSendPushNotification } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

function NotificationsForm() {
  const { t } = useTranslation();

  const hForm = useForm<any>({
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
      notification(t("admin:pages.notification.form.success"), NotificationType.Success);
    } else {
      notification(t("admin:pages.notification.form.error"));
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <TextBoxField name="title" type="text" label={t("admin:pages.notification.form.title")} />
        <TextBoxField name="body" type="text" label={t("admin:pages.notification.form.body")} />
        <TextBoxField name="icon" type="text" label={t("admin:pages.notification.form.icon")} />
        <TextBoxField
          name="clickAction"
          type="text"
          label={t("admin:pages.notification.form.link")}
        />
        <Flex justifyContent="space-between" alignItems="center">
          <SubmitButton rightIcon={<ArrowForwardIcon />}>Submit</SubmitButton>
        </Flex>
      </form>
    </FormProvider>
  );
}

export default NotificationsForm;
