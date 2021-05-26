import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import { axSendPushNotification } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
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
      notification(t("ADMIN.PAGES.NOTIFICATION.FORM.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("ADMIN.PAGES.NOTIFICATION.FORM.ERROR"));
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <TextBoxField name="title" type="text" label={t("ADMIN.PAGES.NOTIFICATION.FORM.TITLE")} />
        <TextBoxField name="body" type="text" label={t("ADMIN.PAGES.NOTIFICATION.FORM.BODY")} />
        <TextBoxField name="icon" type="text" label={t("ADMIN.PAGES.NOTIFICATION.FORM.ICON")} />
        <TextBoxField
          name="clickAction"
          type="text"
          label={t("ADMIN.PAGES.NOTIFICATION.FORM.LINK")}
        />
        <Flex justifyContent="space-between" alignItems="center">
          <SubmitButton rightIcon={<ArrowForwardIcon />}>Submit</SubmitButton>
        </Flex>
      </form>
    </FormProvider>
  );
}

export default NotificationsForm;
