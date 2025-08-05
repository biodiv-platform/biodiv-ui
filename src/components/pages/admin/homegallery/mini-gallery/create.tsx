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
import { axCreateMiniGallery } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

export default function CreateMiniGalleryForm({
  setIsCreate,
  miniGalleryList,
  setMiniGalleryList,
  languages,
  sliderList,
  setSliderList,
  setOpenIndex
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
      Yup.lazy((value) => {
        const languageMapShape: Record<string, Yup.ArraySchema<any>> = {};

        for (const langId in value || {}) {
          languageMapShape[langId] = Yup.array().of(
            Yup.object().shape({
              title: Yup.string().required("Title is required"),
              isVertical: Yup.boolean(),
              slidesPerView: Yup.string()
            })
          );
        }

        return Yup.object().shape(languageMapShape);
      })
    ),
    defaultValues: {
      [SITE_CONFIG.LANG.DEFAULT_ID]: [
        {
          isVertical: "false",
          slidesPerView: 3,
          languageId: languageId
        }
      ]
    }
  });

  const handleFormSubmit = async (value) => {
    const payload = Object.fromEntries(
      Object.entries(value).map(([langId, items]) => [
        langId,
        (items as any[]).map((item) => ({
          ...item,
          slidesPerView: Number(item.slidesPerView),
          isVertical: Boolean(item.isVertical)
        }))
      ])
    );
    const { success, data } = await axCreateMiniGallery(payload);
    if (success) {
      notification(
        t("group:homepage_customization.mini_gallery_setup.create_success"),
        NotificationType.Success
      );
      setOpenIndex(miniGalleryList.length)
      setMiniGalleryList([...miniGalleryList, ...Object.entries(data)]);
      setSliderList([...sliderList, []]);
      setIsCreate(false);
    } else {
      notification(
        t("group:homepage_customization.mini_gallery_setup.create_error"),
        NotificationType.Error
      );
    }
  };

  const handleAddTranslation = () => {
    hForm.setValue(`${langId}`, [
      {
        isVertical: hForm.getValues()[translationSelected][0].isVertical,
        languageId: langId,
        slidesPerView: hForm.getValues()[translationSelected][0].slidesPerView,
        title: ""
      }
    ]);
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
          values={Object.keys(hForm.getValues())}
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
              name={`${translationSelected}.0.title`}
              isRequired={true}
              label={
                translationSelected != SITE_CONFIG.LANG.DEFAULT_ID
                  ? hForm.getValues()[SITE_CONFIG.LANG.DEFAULT_ID][0].title
                  : t("group:homepage_customization.resources.title")
              }
            />
            <RadioInputField
              key={`isVertical-${translationSelected}`}
              name={`${translationSelected}.0.isVertical`}
              label={t("group:homepage_customization.mini_gallery_setup.vertical_label")}
              options={SLIDER_TYPE}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
              onChangeCallback={(e) => {
                const values = hForm.getValues();

                for (const langId in values) {
                  const entry = values[langId]?.[0];
                  if (entry) {
                    hForm.setValue(`${langId}.0.isVertical`, e);
                  }
                }
              }}
            />
            <NumberInputField
              key={`slidesPerView-${translationSelected}`}
              name={`${translationSelected}.0.slidesPerView`}
              label={t("group:homepage_customization.mini_gallery_setup.slides_per_view")}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
              onChangeCallback={(e) => {
                const values = hForm.getValues();

                for (const langId in values) {
                  const entry = values[langId]?.[0];
                  if (entry) {
                    hForm.setValue(`${langId}.0.slidesPerView`, e);
                  }
                }
              }}
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
