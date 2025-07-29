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
    Object.entries(homePageDetails?.gallerySlider || {}).sort((a, b) => {
      const aOrder = parseInt(a[0].split("|")[1], 10);
      const bOrder = parseInt(b[0].split("|")[1], 10);
      return aOrder - bOrder;
    })
  );

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const updatedMiniGallery = homePageDetails?.miniGallery?.map((item) => {
    const sortedGallerySlider = Object.entries(item?.gallerySlider || {}).sort((a, b) => {
      const aOrder = parseInt(a[0].split("|")[1], 10);
      const bOrder = parseInt(b[0].split("|")[1], 10);
      return aOrder - bOrder;
    });

    return {
      ...item,
      gallerySlider: sortedGallerySlider
    };
  });
  const [miniGalleryList, setMiniGalleryList] = useState(updatedMiniGallery);

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
      gallerySlider: galleryList.reduce((acc, item, index) => {
        const sliderId = item[0].split("|")[0];
        const languageMap = item[1] as Record<number, any[]>;

        if (sliderId === "null") {
          for (const langId in languageMap) {
            languageMap[langId] = languageMap[langId].map((entry) => ({
              ...entry,
              displayOrder: index
            }));
          }
          acc[`null|${index}`] = languageMap;
        }

        return acc;
      }, {}),

      miniGallery: miniGalleryList.map(({ gallerySlider, ...item }) => {
        const updatedGallerySlider = gallerySlider.reduce((acc: any, item: any, index: number) => {
          const sliderId = item[0].split("|")[0];
          const languageMap = item[1] as Record<number, any[]>;

          if (sliderId === "null") {
            for (const langId in languageMap) {
              languageMap[langId] = languageMap[langId].map((entry) => ({
                ...entry,
                displayOrder: index
              }));
            }
            acc[`null|${index}`] = languageMap;
          }

          return acc;
        }, {});

        return {
          ...item,
          gallerySlider: updatedGallerySlider
        };
      }),

      ...value
    };
    const { success, data } = await axInsertHomePageGallery(payload);
    if (success) {
      setGalleryList(
        Object.entries(data.gallerySlider || {}).sort((a, b) => {
          const aOrder = parseInt(a[0].split("|")[1], 10);
          const bOrder = parseInt(b[0].split("|")[1], 10);
          return aOrder - bOrder;
        })
      );
      const updatedMiniGallery = data?.miniGallery.map((item) => {
        const sortedGallerySlider = Object.entries(item?.gallerySlider || {}).sort((a, b) => {
          const aOrder = parseInt(a[0].split("|")[1], 10);
          const bOrder = parseInt(b[0].split("|")[1], 10);
          return aOrder - bOrder;
        });

        return {
          ...item,
          gallerySlider: sortedGallerySlider
        };
      });
      setMiniGalleryList(updatedMiniGallery);
      notification(t("group:homepage_customization.success"), NotificationType.Success);
    } else {
      notification(t("group:homepage_customization.failure"), NotificationType.Error);
    }
  };

  return (
    <>
      {currentStep == 0 && (
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
              <SwitchField name="showSponsors" label="Show sponsors" />
              <SwitchField name="showDonors" label="Show donors" />
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
      {currentStep == 1 && (
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
      {currentStep == 2 && (
        <MiniGallery
          miniGallery={miniGalleryList}
          setMiniGallery={setMiniGalleryList}
          languages={languages}
        />
      )}
      <Box hidden={isCreate || isEdit} display="flex" m={4} justifyContent="flex-end">
        <Button colorPalette="blue" onClick={hForm.handleSubmit(handleFormSubmit)}>
          {t("common:save")}
        </Button>
      </Box>
    </>
  );
}
