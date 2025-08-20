import { Box, Button } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import * as Yup from "yup";

import { NumberInputField } from "@/components/form/number-input";
import { RadioInputField } from "@/components/form/radio";
import { TextBoxField } from "@/components/form/text";
import TranslationTab from "@/components/pages/common/translation-tab";
import useGlobalState from "@/hooks/use-global-state";
import { axCreateMiniGroupGallery } from "@/services/usergroup.service";
import { axCreateMiniGallery } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

export default function CreateMiniGalleryForm({
  setIsCreate,
  miniGalleryList,
  setMiniGalleryList,
  languages,
  setOpenIndex,
  groupId,
  mode
}) {
  const { t } = useTranslation();

  const { languageId } = useGlobalState();
  const [translationSelected, setTranslationSelected] = useState<number>(languageId);
  const [langId, setLangId] = useState(0);

  const SLIDER_TYPE = [
    {
      label: t("group:homepage_customization.mini_gallery_setup.horizontal_slider_label"),
      value: "false"
    },
    {
      label: t("group:homepage_customization.mini_gallery_setup.vertical_slider_label"),
      value: "true"
    }
  ];

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        translations: Yup.lazy((value) => {
          const languageMapShape: Record<string, any> = {};

          for (const langId in value || {}) {
            languageMapShape[langId] = Yup.object().shape({
              title: Yup.string().required("Title is required"),
              languageId: Yup.number()
            });
          }

          return Yup.object().shape(languageMapShape);
        }),
        isVertical: Yup.boolean(),
        slidesPerView: Yup.string()
      })
    ),
    defaultValues: {
      translations: {
        [SITE_CONFIG.LANG.DEFAULT_ID]:
          {
            languageId: SITE_CONFIG.LANG.DEFAULT_ID,
            title: "",
            id: null
          }
      },
      isVertical: "false",
      slidesPerView: 3,
      languageId: languageId
    }
  });

  const handleFormSubmit = async (value) => {
    const payload = {
      ...value,
      slidesPerView: Number(value.slidesPerView),
      isVertical: Boolean(value.isVertical),
      translations: Object.values(value.translations)
    };;
    if (mode == "edit") {
      const { success, data } =
        groupId == -1
          ? await axCreateMiniGallery(payload)
          : await axCreateMiniGroupGallery(payload, groupId);
      if (success) {
        notification(
          t("group:homepage_customization.mini_gallery_setup.create_success"),
          NotificationType.Success
        );
        setOpenIndex(miniGalleryList.length);
        data.gallerySlider=[];
        setMiniGalleryList([...miniGalleryList, data]);
        setIsCreate(false);
      } else {
        notification(
          t("group:homepage_customization.mini_gallery_setup.create_error"),
          NotificationType.Error
        );
      }
    } else {
      notification(
        t("group:homepage_customization.mini_gallery_setup.create_success"),
        NotificationType.Success
      );
      setOpenIndex(miniGalleryList.length);
      setMiniGalleryList([...miniGalleryList, [null, payload]]);
      setIsCreate(false);
    }
  };

  const handleAddTranslation = () => {
    hForm.setValue(`translations.${langId}`, {
      id: null,
      title: "",
      languageId: langId
    });
    setTranslationSelected(langId);
  };

  return (
    <>
      <FormProvider {...hForm}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button m={3} type="button" onClick={() => setIsCreate(false)} variant={"subtle"}>
            <LuArrowLeft />
            {t("group:homepage_customization.back")}
          </Button>
        </Box>
        <TranslationTab
          values={Object.keys(hForm.getValues().translations)}
          setLangId={setLangId}
          languages={languages}
          handleAddTranslation={handleAddTranslation}
          translationSelected={translationSelected}
          setTranslationSelected={setTranslationSelected}
        />
        <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
          <Box m={3}>
            <TextBoxField
              key={`title-${translationSelected}`}
              name={`translations.${translationSelected}.title`}
              isRequired={true}
              label={
                translationSelected != SITE_CONFIG.LANG.DEFAULT_ID
                  ? hForm.getValues().translations[SITE_CONFIG.LANG.DEFAULT_ID].title
                  : t("group:homepage_customization.resources.title")
              }
            />
            <RadioInputField
              key={`isVertical`}
              name={`isVertical`}
              label={t("group:homepage_customization.mini_gallery_setup.vertical_label")}
              options={SLIDER_TYPE}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            />
            <NumberInputField
              key={`slidesPerView`}
              name={`slidesPerView`}
              label={t("group:homepage_customization.mini_gallery_setup.slides_per_view")}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            />
            <SubmitButton>
              {t("group:homepage_customization.mini_gallery_setup.create")}
            </SubmitButton>
          </Box>
        </form>
      </FormProvider>
    </>
  );
}
