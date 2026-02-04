import { Box, Button } from "@chakra-ui/react";
import { SwitchField } from "@components/form/switch";
import { axUploadHomePageEditorResource } from "@services/pages.service";
import { axInsertHomePageGallery } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import GallerySetup from "./gallery-setup";
import MiniGallery from "./mini-gallery";

const WYSIWYGField = dynamic(() => import("@components/form/wysiwyg"), { ssr: false });

export default function HomePageGalleryCustomizationForm({
  homePageDetails,
  languages,
  currentStep
}) {
  const { t } = useTranslation();
  const [galleryList, setGalleryList] = useState(
    homePageDetails?.gallerySlider?.sort((a, b) => a.displayOrder - b.displayOrder) || []
  );
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [miniGalleryList, setMiniGalleryList] = useState(homePageDetails?.miniGallery);

  const {
    gallerySlider,
    showGallery,
    showStats,
    showRecentObservation,
    showGridMap,
    showPartners,
    showSponsors,
    showDonors,
    showDesc,
    description
  } = homePageDetails;

  const hForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      gallerySlider,
      showGallery,
      showStats,
      showRecentObservation,
      showGridMap,
      showPartners,
      showSponsors,
      showDonors,
      showDesc,
      description
    }
  });

  const handleFormSubmit = async ({ gallerySlider, ...value }) => {
    const payload = {
      ...value
    };
    const { success, data } = await axInsertHomePageGallery(payload);
    if (success) {
      setGalleryList(data.gallerySlider?.sort((a, b) => a.displayOrder - b.displayOrder));
      setMiniGalleryList(data?.miniGallery);
      notification(t("group:homepage_customization.success"), NotificationType.Success);
    } else {
      notification(t("group:homepage_customization.failure"), NotificationType.Error);
    }
  };

  return (
    <>
      {currentStep == "group:homepage_customization.title" && (
        <FormProvider {...hForm}>
          <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
            <Box width={["100%", 350]} justifyContent="space-between">
              <SwitchField name="showGallery" label={t("group:homepage_customization.gallery")} />
              <SwitchField
                name="showStats"
                label={t("group:homepage_customization.module_stats")}
              />
              <SwitchField
                name="showRecentObservation"
                label={t("group:homepage_customization.recent_observation")}
              />
              <SwitchField
                name="showGridMap"
                label={t("group:homepage_customization.observation_map")}
              />
              <SwitchField name="showPartners" label={t("group:homepage_customization.about_us")} />
              <SwitchField
                name="showSponsors"
                label={t("group:homepage_customization.show_sponsors")}
              />
              <SwitchField
                name="showDonors"
                label={t("group:homepage_customization.show_donors")}
              />
              <SwitchField name="showDesc" label={t("group:homepage_customization.show_desc")} />
            </Box>
            <WYSIWYGField
              name="description"
              label={t("form:description.title")}
              uploadHandler={axUploadHomePageEditorResource}
            />
          </form>
        </FormProvider>
      )}
      {currentStep == "group:homepage_customization.gallery_setup.title" && (
        <GallerySetup
          isCreate={isCreate}
          setIsCreate={setIsCreate}
          setGalleryList={setGalleryList}
          galleryList={galleryList}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          languages={languages}
        />
      )}
      {currentStep == "group:homepage_customization.mini_gallery_setup.title" && (
        <MiniGallery
          miniGallery={miniGalleryList}
          setMiniGallery={setMiniGalleryList}
          languages={languages}
        />
      )}
      {currentStep == "group:homepage_customization.title" && (
        <Box hidden={isCreate || isEdit} display="flex" m={4} justifyContent="flex-end">
          <Button colorPalette="blue" onClick={hForm.handleSubmit(handleFormSubmit)}>
            {t("common:save")}
          </Button>
        </Box>
      )}
    </>
  );
}
