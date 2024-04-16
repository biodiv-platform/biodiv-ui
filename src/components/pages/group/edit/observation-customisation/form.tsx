import { Box, Button } from "@chakra-ui/react";
import { SwitchField } from "@components/form/switch";
import { yupResolver } from "@hookform/resolvers/yup";
import { axUpdateGroupObsCustomisations } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function ObservationCustomizationForm({ userGroupId, mediaToggle }) {
  const { t } = useTranslation();

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        mediaToggle: Yup.boolean()
      })
    ),
    defaultValues: {
      mediaToggle: mediaToggle == "withMedia" ? true : false
    }
  });

  const handleFormSubmit = async (e) => {
    const payload = {
      userGroupId: userGroupId,
      mediaToggle: e.mediaToggle == true ? "withMedia" : "All"
    };
    const { success } = await axUpdateGroupObsCustomisations(payload);
    if (success) {
      notification(t("group:homepage_customization.success"), NotificationType.Success);
    } else {
      notification(t("group:homepage_customization.failure"), NotificationType.Error);
    }
  };

  return (
    <>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
          <SwitchField name="mediaToggle" label="Only With Media" />
        </form>
      </FormProvider>

      <Box display="flex" m={4} justifyContent="flex-end">
        <Button colorScheme="blue" onClick={hForm.handleSubmit(handleFormSubmit)}>
          Update
        </Button>
      </Box>
    </>
  );
}
