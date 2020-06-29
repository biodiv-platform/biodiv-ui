import { Flex } from "@chakra-ui/core";
import Submit from "@components/form/submit-button";
import TextBox from "@components/form/text";
import { axSendPushNotification } from "@services/user.service";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

function NotificationsForm() {
  const hForm = useForm({
    validationSchema: Yup.object().shape({
      title: Yup.string().required(),
      body: Yup.string().required()
    })
  });

  const handleOnSubmit = async (v) => {
    const payload = {
      title: v.title,
      body: v.body
    };

    const { success } = await axSendPushNotification(payload);

    if (success) {
      console.debug("Success");
    } else {
      console.debug("Failed");
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
      <TextBox name="title" type="text" label="Title" form={hForm} />
      <TextBox name="body" type="text" label="Body" form={hForm} />
      <Flex justifyContent="space-between" alignItems="center">
        <Submit form={hForm} rightIcon="arrow-forward">
          Submit
        </Submit>
      </Flex>
    </form>
  );
}

export default NotificationsForm;
