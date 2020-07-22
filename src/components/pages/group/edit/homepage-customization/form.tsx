import { Box, Button } from "@chakra-ui/core";
import RichTextareaField from "@components/form/rich-textarea";
import SwitchButton from "@components/form/switch";
import useTranslation from "@configs/i18n/useTranslation";
import { yupResolver } from "@hookform/resolvers";
import { axUpdateHomePageDetails } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import GallerySetup from "./gallery-setup";

export default function HomePageCustomizationForm({ userGroupId, homePageDetails }) {
  const { t } = useTranslation();
  const [galleryList, setGalleryList] = useState(homePageDetails?.gallerySlider || []);
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

  const hForm = useForm({
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

  const handleFormSubmit = async (value) => {
    const payload = {
      gallerySlider: galleryList.reduce((acc, item, index) => {
        if (item["id"] === undefined) {
          acc.push({ ugId: userGroupId, displayOrder: index, ...item });
        }
        return acc;
      }, []),
      ...value
    };

    const { success, data } = await axUpdateHomePageDetails(userGroupId, payload);
    if (success) {
      setGalleryList(data.gallerySlider);
      notification(t("GROUP.HOMEPAGE_CUSTOMIZATION.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("GROUP.HOMEPAGE_CUSTOMIZATION.FAILURE"), NotificationType.Error);
    }
  };

  return (
    <>
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
        <Box width={["100%", 350]} justifyContent="space-between">
          <SwitchButton
            name="showGallery"
            form={hForm}
            label={t("GROUP.HOMEPAGE_CUSTOMIZATION.GALLERY")}
          />
          <SwitchButton
            name="showStats"
            form={hForm}
            label={t("GROUP.HOMEPAGE_CUSTOMIZATION.MODULE_STATS")}
          />
          <SwitchButton
            name="showRecentObservation"
            form={hForm}
            label={t("GROUP.HOMEPAGE_CUSTOMIZATION.RECENT_OBSERVATION")}
          />
          <SwitchButton
            name="showGridMap"
            form={hForm}
            label={t("GROUP.HOMEPAGE_CUSTOMIZATION.OBSERVATION_MAP")}
          />
          <SwitchButton
            name="showPartners"
            form={hForm}
            label={t("GROUP.HOMEPAGE_CUSTOMIZATION.ABOUT_US")}
          />
          <SwitchButton
            name="showDesc"
            form={hForm}
            label={t("GROUP.HOMEPAGE_CUSTOMIZATION.SHOW_DESC")}
          />
        </Box>
        <RichTextareaField name="description" label={t("GROUP.DESCRIPTION")} form={hForm} />
      </form>
      <GallerySetup
        userGroupId={userGroupId}
        isCreate={isCreate}
        setIsCreate={setIsCreate}
        setGalleryList={setGalleryList}
        galleryList={galleryList}
      />
      <Box hidden={isCreate} display="flex" m={4} justifyContent="flex-end">
        <Button variantColor="blue" onClick={hForm.handleSubmit(handleFormSubmit)}>
          {t("GROUP.HOMEPAGE_CUSTOMIZATION.SAVE")}
        </Button>
      </Box>
    </>
  );
}
