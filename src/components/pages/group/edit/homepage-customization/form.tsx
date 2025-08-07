import { Box, Button } from "@chakra-ui/react";
import { SwitchField } from "@components/form/switch";
import { yupResolver } from "@hookform/resolvers/yup";
import { axUpdateGroupHomePageDetails } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import MiniGallery from "@/components/pages/admin/homegallery/mini-gallery";

import GallerySetup from "./gallery-setup";

export default function HomePageCustomizationForm({
  userGroupId,
  homePageDetails,
  currentStep,
  languages
}) {
  const { t } = useTranslation();
  const [galleryList, setGalleryList] = useState(
    Object.entries(homePageDetails?.gallerySlider || {}).sort((a, b) => {
      const aOrder = parseInt(a[0].split("|")[1], 10);
      const bOrder = parseInt(b[0].split("|")[1], 10);
      return aOrder - bOrder;
    })
  );
  const updatedMiniGallery = homePageDetails?.miniGallerySlider.map((item) => {
    const sortedGallerySlider = Object.entries(item || {}).sort((a, b) => {
      const aOrder = parseInt(a[0].split("|")[1], 10);
      const bOrder = parseInt(b[0].split("|")[1], 10);
      return aOrder - bOrder;
    });

    return sortedGallerySlider;
  });
  const [miniGalleryList, setMiniGalleryList] = useState(
    Object.entries(homePageDetails?.miniGallery)
  );
  const [miniGallerySliderList, setMiniGallerySliderList] = useState(updatedMiniGallery);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
      gallerySlider: galleryList.reduce<Record<number, any[]>[]>((acc, item, index) => {
        const sliderId = item[0].split("|")[0];
        const languageMap = item[1] as Record<number, any[]>;

        if (sliderId === "null") {
          for (const langId in languageMap) {
            languageMap[langId] = languageMap[langId].map((entry) => ({
              ...entry,
              ugId: userGroupId,
              displayOrder: index
            }));
          }
          acc.push(languageMap);
        }

        return acc;
      }, []),

      miniGallerySlider: miniGallerySliderList.map((item) => {
        const updatedGallerySlider = item.reduce((acc: any, item: any, index: number) => {
          const sliderId = item[0].split("|")[0];
          const languageMap = item[1] as Record<number, any[]>;

          if (sliderId === "null") {
            for (const langId in languageMap) {
              languageMap[langId] = languageMap[langId].map((entry) => ({
                ...entry,
                ugId: userGroupId,
                displayOrder: index
              }));
            }
            acc[`null|${index}`] = languageMap;
          }

          return acc;
        }, {});

        return updatedGallerySlider;
      }),
      ...value
    };

    const { success, data } = await axUpdateGroupHomePageDetails(userGroupId, payload);
    if (success) {
      setGalleryList(
        Object.entries(data.gallerySlider || {}).sort((a, b) => {
          const aOrder = parseInt(a[0].split("|")[1], 10);
          const bOrder = parseInt(b[0].split("|")[1], 10);
          return aOrder - bOrder;
        })
      );
      const updatedMiniGallery = data?.miniGallerySlider.map((item) => {
        const sortedGallerySlider = Object.entries(item || {}).sort((a, b) => {
          const aOrder = parseInt(a[0].split("|")[1], 10);
          const bOrder = parseInt(b[0].split("|")[1], 10);
          return aOrder - bOrder;
        });

        return sortedGallerySlider;
      });
      setMiniGallerySliderList(updatedMiniGallery);
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
              <SwitchField name="showDesc" label={t("group:homepage_customization.show_desc")} />
            </Box>
          </form>
        </FormProvider>
      )}
      {currentStep == "group:homepage_customization.gallery_setup.title" && (
        <GallerySetup
          userGroupId={userGroupId}
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
          sliderList={miniGallerySliderList}
          setSliderList={setMiniGallerySliderList}
          handleFormSubmit={hForm.handleSubmit(handleFormSubmit)}
          groupId={userGroupId}
        />
      )}
      {currentStep != "group:homepage_customization.mini_gallery_setup.title" && (
        <Box hidden={isCreate || isEdit} display="flex" m={4} justifyContent="flex-end">
          <Button colorPalette="blue" onClick={hForm.handleSubmit(handleFormSubmit)}>
            {t("group:homepage_customization.save")}
          </Button>
        </Box>
      )}
    </>
  );
}
