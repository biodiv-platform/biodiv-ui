import { Box } from "@chakra-ui/core";
import RichTextareaField from "@components/form/rich-textarea";
import SubmitButton from "@components/form/submit-button";
import SwitchButton from "@components/form/switch";
import useTranslation from "@configs/i18n/useTranslation";
import { yupResolver } from "@hookform/resolvers";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import GallerySetup from "./gallery-setup";

export default function HomePageCustomizationForm({ userGroupId, homePageDetails }) {
  const { t } = useTranslation();
  const [galleryList, setGalleryList] = useState(homePageDetails?.gallerySlider || []);

  const {
    showGallery,
    showStats,
    showRecentObs,
    showGridMap,
    showPartners,
    gallerySlider,
    ugDescription
  } = homePageDetails;

  const hForm = useForm({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        showGallery: Yup.boolean(),
        showStats: Yup.boolean(),
        showRecentObs: Yup.boolean(),
        showGridMap: Yup.boolean(),
        showPartners: Yup.boolean(),
        ugDescription: Yup.string()
      })
    ),
    defaultValues: {
      showGallery,
      showStats,
      showRecentObs,
      showGridMap,
      showPartners,
      gallerySlider,
      ugDescription
    }
  });

  return (
    <>
      <form className="fade">
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
            name="showRecentObs"
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
        </Box>
        <RichTextareaField name="ugDescription" label={t("GROUP.DESCRIPTION")} form={hForm} />
        <GallerySetup
          userGroupId={userGroupId}
          setGalleryList={setGalleryList}
          galleryList={galleryList}
        />
        <Box display="flex" m={4} justifyContent="flex-end">
          <SubmitButton form={hForm}>{t("GROUP.HOMEPAGE_CUSTOMIZATION.SAVE")}</SubmitButton>
        </Box>
      </form>
    </>
  );
}
