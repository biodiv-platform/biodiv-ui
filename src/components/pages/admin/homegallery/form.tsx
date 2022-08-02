import { Box, Button } from "@chakra-ui/react";
import { axInsertHomePageGallery } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import GallerySetup from "./gallery-setup";

export default function HomePageGalleryCustomizationForm({ homePageDetails }) {
  const { t } = useTranslation();
  const [galleryList, setGalleryList] = useState(
    homePageDetails?.gallerySlider?.sort((a, b) => a.displayOrder - b.displayOrder) || []
  );

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const { gallerySlider } = homePageDetails;

  const hForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      gallerySlider
    }
  });

  const handleFormSubmit = async ({ gallerySlider, ...value }) => {
    const payload = {
      gallerySlider: galleryList.reduce((acc, item, index) => {
        if (!item.id) {
          acc.push({ displayOrder: index, ...item });
        }
        return acc;
      }, []),
      ...value
    };
    const { success, data } = await axInsertHomePageGallery(payload);
    if (success) {
      setGalleryList(data.gallerySlider?.sort((a, b) => a.displayOrder - b.displayOrder));
      notification(t("group:homepage_customization.success"), NotificationType.Success);
    } else {
      notification(t("group:homepage_customization.failure"), NotificationType.Error);
    }
  };

  return (
    <>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade"></form>
      </FormProvider>
      <GallerySetup
        isCreate={isCreate}
        setIsCreate={setIsCreate}
        setGalleryList={setGalleryList}
        galleryList={galleryList}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <Box hidden={isCreate || isEdit} display="flex" m={4} justifyContent="flex-end">
        <Button colorScheme="blue" onClick={hForm.handleSubmit(handleFormSubmit)}>
          {t("common:save")}
        </Button>
      </Box>
    </>
  );
}
