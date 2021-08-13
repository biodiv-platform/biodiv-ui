import { Box, Button } from "@chakra-ui/react";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SwitchField } from "@components/form/switch";
import { yupResolver } from "@hookform/resolvers/yup";
import { axUpdateHomePageDetails } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import GallerySetup from "./gallery-setup";

export default function HomePageCustomizationForm({ userGroupId, homePageDetails }) {
  const { t } = useTranslation();
  const [galleryList, setGalleryList] = useState(
    homePageDetails?.gallerySlider?.sort((a, b) => a.displayOrder - b.displayOrder) || []
  );
  const [isCreate, setIsCreate] = useState(false);

  const {
    showGallery,
    showStats,
    showDesc,
    showRecentObservation,
    showGridMap,
    showPartners,
    gallerySlider,
    description
  } = homePageDetails;

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        showGallery: Yup.boolean(),
        showStats: Yup.boolean(),
        showDesc: Yup.boolean(),
        showRecentObservation: Yup.boolean(),
        showGridMap: Yup.boolean(),
        showPartners: Yup.boolean(),
        description: Yup.string()
      })
    ),
    defaultValues: {
      showGallery,
      showStats,
      showRecentObservation,
      showGridMap,
      showPartners,
      showDesc,
      gallerySlider,
      description
    }
  });

  const handleFormSubmit = async ({ gallerySlider, ...value }) => {
    const payload = {
      gallerySlider: galleryList.reduce((acc, item, index) => {
        if (!item.id) {
          acc.push({ ugId: userGroupId, displayOrder: index, ...item });
        }
        return acc;
      }, []),
      ...value
    };
    const { success, data } = await axUpdateHomePageDetails(userGroupId, payload);
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
        <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
          <Box width={["100%", 350]} justifyContent="space-between">
            <SwitchField name="showGallery" label={t("group:homepage_customization.gallery")} />
            <SwitchField name="showStats" label={t("group:homepage_customization.module_stats")} />
            <SwitchField
              name="showRecentObservation"
              label={t("group:homepage_customization.recent_observation")}
            />
            <SwitchField
              name="showGridMap"
              label={t("group:homepage_customization.observation_map")}
            />
            <SwitchField name="showPartners" label={t("group:homepage_customization.about_us")} />
            <SwitchField name="showDesc" label={t("group:homepage_customization.show_desc")} />
          </Box>
          <RichTextareaField name="description" label={t("form:description.title")} />
        </form>
      </FormProvider>
      <GallerySetup
        userGroupId={userGroupId}
        isCreate={isCreate}
        setIsCreate={setIsCreate}
        setGalleryList={setGalleryList}
        galleryList={galleryList}
      />
      <Box hidden={isCreate} display="flex" m={4} justifyContent="flex-end">
        <Button colorScheme="blue" onClick={hForm.handleSubmit(handleFormSubmit)}>
          {t("group:homepage_customization.save")}
        </Button>
      </Box>
    </>
  );
}
