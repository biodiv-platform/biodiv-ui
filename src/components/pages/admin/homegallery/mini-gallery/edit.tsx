import { Box, Button } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import * as Yup from "yup";

import { NumberInputField } from "@/components/form/number-input";
import { SwitchField } from "@/components/form/switch";
import { TextBoxField } from "@/components/form/text";
import { axEditMiniGallery } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

export default function EditMiniGalleryForm({
  setIsEdit,
  editGalleryData,
  miniGalleryList,
  setMiniGalleryList,
  index
}) {
  const { t } = useTranslation();

  const {slidesPerView, ...value} = editGalleryData

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required("Title is required"),
        isVertical: Yup.boolean(),
        slidesPerView: Yup.string(),
        isActive: Yup.boolean()
      })
    ),
    defaultValues: {
        slidesPerView: slidesPerView.toString(),
        ...value
    }
  });

  const handleFormSubmit = async ({ slidesPerView, ...value }) => {
    const { success, data } = await axEditMiniGallery(editGalleryData.id,{
      slidesPerView: Number(slidesPerView),
      ...value
    });
    if (success) {
      notification(
        t("group:homepage_customization.mini_gallery_setup.edit_success"),
        NotificationType.Success
      );
      miniGalleryList[index] = data;
      setMiniGalleryList(miniGalleryList);
      setIsEdit(false);
    } else {
      notification(
        t("group:homepage_customization.mini_gallery_setup.edit_error"),
        NotificationType.Error
      );
    }
  };

  return (
    <>
      <FormProvider {...hForm}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button m={3} type="button" onClick={() => setIsEdit(false)} variant={"subtle"}>
            <LuArrowLeft />
            {t("group:homepage_customization.back")}
          </Button>
        </Box>
        <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
          <Box m={3}>
            <TextBoxField
              key={`title`}
              name={`title`}
              isRequired={true}
              label={t("group:homepage_customization.resources.title")}
            />
            <SwitchField
              name="isVertical"
              label={t("group:homepage_customization.mini_gallery_setup.vertical_label")}
            />
            <SwitchField
              name="isActive"
              label={t("group:homepage_customization.mini_gallery_setup.active_label")}
            />
            <NumberInputField
              name="slidesPerView"
              label={t("group:homepage_customization.mini_gallery_setup.slides_per_view")}
            />
            <SubmitButton>
              {t("common:update")}
            </SubmitButton>
          </Box>
        </form>
      </FormProvider>
    </>
  );
}
