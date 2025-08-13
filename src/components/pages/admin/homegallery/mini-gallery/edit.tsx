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
import { SwitchField } from "@/components/form/switch";
import { TextBoxField } from "@/components/form/text";
import TranslationTab from "@/components/pages/common/translation-tab";
import useGlobalState from "@/hooks/use-global-state";
import { axEditMiniGroupGallery } from "@/services/usergroup.service";
import { axEditMiniGallery } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

export default function EditMiniGalleryForm({
  setIsEdit,
  editGalleryData,
  miniGalleryList,
  setMiniGalleryList,
  index,
  languages,
  groupId
}) {
  const { t } = useTranslation();

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

  const { languageId } = useGlobalState();
  const [translationSelected, setTranslationSelected] = useState<number>(
    Number(Object.keys(editGalleryData[1])[0])
  );
  const [langId, setLangId] = useState(0);

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
              slidesPerView: Yup.string(),
              isActive: Yup.boolean()
            })
          );
        }

        return Yup.object().shape(languageMapShape);
      })
    ),
    defaultValues: Object.entries(editGalleryData[1]).reduce((acc, [langId, configs]) => {
      acc[langId] = (configs as any[]).map((config) => ({
        ...config,
        isVertical: config.isVertical.toString()
      }));
      return acc;
    }, {})
  });

  if (Object.keys(hForm.getValues()).includes(languageId)) {
    setTranslationSelected(languageId);
  }

  const handleAddTranslation = () => {
    hForm.setValue(`${langId}`, [
      {
        galleryId: hForm.getValues()[translationSelected][0].galleryId,
        id: null,
        isActive: hForm.getValues()[translationSelected][0].isActive,
        isVertical: hForm.getValues()[translationSelected][0].isVertical,
        languageId: langId,
        slidesPerView: hForm.getValues()[translationSelected][0].slidesPerView,
        title: "",
        ugId: hForm.getValues()[translationSelected][0].ugId
      }
    ]);
    setTranslationSelected(langId);
  };

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
    const { success, data } =
      groupId == -1
        ? await axEditMiniGallery(editGalleryData[0], payload)
        : await axEditMiniGroupGallery(groupId, editGalleryData[0], payload);
    if (success) {
      notification(
        t("group:homepage_customization.mini_gallery_setup.edit_success"),
        NotificationType.Success
      );
      miniGalleryList[index] = Object.entries(data)[0];
      setMiniGalleryList(miniGalleryList);
      setIsEdit(false);
    } else {
      notification(
        t("group:homepage_customization.mini_gallery_setup.edit_error"),
        NotificationType.Error
      );
    }
  };

  return (
    <>
      <FormProvider {...hForm}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button m={3} type="button" onClick={() => setIsEdit(false)} variant={"subtle"}>
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
            <SwitchField
              key={`isActive-${translationSelected}`}
              name={`${translationSelected}.0.isActive`}
              label={t("group:homepage_customization.mini_gallery_setup.active_label")}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
              onChangeCallback={(e) => {
                const values = hForm.getValues();

                for (const langId in values) {
                  const entry = values[langId]?.[0];
                  if (entry) {
                    hForm.setValue(`${langId}.0.isActive`, e);
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
            <SubmitButton>{t("common:update")}</SubmitButton>
          </Box>
        </form>
      </FormProvider>
    </>
  );
}
