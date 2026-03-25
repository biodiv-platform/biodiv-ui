import { Box, Button, Grid } from "@chakra-ui/react";
import { SwitchField } from "@components/form/switch";
import { yupResolver } from "@hookform/resolvers/yup";
import { axUploadHomePageEditorResource } from "@services/pages.service";
import { axInsertHomePageGallery } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { TextBoxField } from "@/components/form/text";
import SITE_CONFIG from "@/configs/site-config";

import TranslationTab from "../../common/translation-tab";
import GallerySetup from "./gallery-setup";
import { LogoField } from "./logo-upload";
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

  const [translationSelected, setTranslationSelected] = useState<number>(
    SITE_CONFIG.LANG.DEFAULT_ID
  );
  const [langId, setLangId] = useState(0);

  const validationSchema = Yup.lazy((value) => {
    const languageMapShape: Record<string, any> = {};

    for (const langId in value || {}) {
      languageMapShape[langId] = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        languageId: Yup.number()
      });
    }

    return Yup.object().shape(languageMapShape);
  });

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
    description,
    title,
    translations,
    siteLogo,
    favIcon
  } = homePageDetails;

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        translations: validationSchema
      })
    ),
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
      description,
      title,
      siteLogo,
      favIcon,
      translations: Object.fromEntries(translations.map((item) => [Number(item.languageId), item]))
    }
  });

  const handleFormSubmit = async ({ translations, gallerySlider, ...value }) => {
    const payload = {
      translations: Object.values(translations),
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

  const handleAddTranslation = () => {
    setTranslationSelected(langId);
    hForm.setValue(`translations.${langId}`, {
      id: null,
      title: "",
      languageId: langId,
      description: "",
      readMoreText: ""
    });
  };

  return (
    <>
      {currentStep == "group:homepage_customization.title" && (
        <FormProvider {...hForm}>
          <TranslationTab
            values={Object.keys(hForm.getValues().translations)}
            setLangId={setLangId}
            languages={languages}
            handleAddTranslation={handleAddTranslation}
            translationSelected={translationSelected}
            setTranslationSelected={setTranslationSelected}
          />
          <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fade">
            <TextBoxField
              key={`title-${translationSelected}`}
              name={`translations.${translationSelected}.title`}
              label={t("Site name")}
              maxLength={"100"}
            />

            <WYSIWYGField
              key={`description-${translationSelected}`}
              name={`translations.${translationSelected}.description`}
              label={t("form:description.title")}
              uploadHandler={axUploadHomePageEditorResource}
            />

            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="6"
              hidden={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            >
              <LogoField name="siteLogo" label={t("Site logo")} />
              <LogoField name="favIcon" label={t("Fav icon")} />
            </Grid>

            <Box
              width={["100%", 350]}
              justifyContent="space-between"
              hidden={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            >
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
