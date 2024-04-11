import { Box, Button } from "@chakra-ui/react";
import { SwitchField } from "@components/form/switch";
import { yupResolver } from "@hookform/resolvers/yup";
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
        mediaToggle: Yup.string()
      })
    ),
    defaultValues: {
      mediaToggle: mediaToggle == "withMedia" ? true : false
    }
  });

  const handleFormSubmit = (e) => {
    //TODO: add api call to update media toggle value
    console.log("e=", e.mediaToggle);
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
