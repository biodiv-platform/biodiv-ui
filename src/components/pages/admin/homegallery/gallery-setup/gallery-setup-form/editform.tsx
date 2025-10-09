import { Box, Button, ColorPicker, HStack, Image, parseColor, Portal } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import { galleryFieldValidationSchema } from "@components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-form/common";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import { axEditHomePageGallery, axMiniEditHomePageGallery } from "@services/utility.service";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import { NotificationType } from "@utils/notification";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import * as Yup from "yup";

import TranslationTab from "@/components/pages/common/translation-tab";

export default function GalleryEditForm({
  setIsEdit,
  setGalleryList,
  editGalleryData,
  languages,
  galleryId = -1,
  index = 0,
  vertical = false
}) {
  const { t } = useTranslation();

  const readMoreUIOptions = [
    { label: t("group:homepage_customization.resources.read_more_link"), value: "link" },
    { label: t("group:homepage_customization.resources.read_more_button"), value: "button" }
  ];

  const gallerySidebarBackgroundOptions = [
    { label: t("group:homepage_customization.resources.sidebar_opaque"), value: "opaque" },
    { label: t("group:homepage_customization.resources.sidebar_translucent"), value: "translucent" }
  ];

  const {
    id,
    title,
    fileName,
    customDescripition,
    moreLinks,
    displayOrder,
    observationId,
    truncated,
    readMoreUIType,
    readMoreText,
    gallerySidebar,
    translations
  } = editGalleryData;

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
  const [color, setColor] = useState(
    editGalleryData.color ? editGalleryData.color : "rgba(255,255,255,1)"
  );
  const [bgColor, setBgColor] = useState(
    editGalleryData.bgColor ? editGalleryData.bgColor : "rgba(26, 32, 44, 1)"
  );

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        translations: validationSchema,
        ...galleryFieldValidationSchema.fields
      })
    ),
    context: { isVertical: vertical },
    defaultValues: {
      id,
      title,
      fileName,
      customDescripition,
      moreLinks,
      displayOrder,
      observationId,
      truncated,
      readMoreUIType,
      readMoreText,
      gallerySidebar,
      galleryId,
      translations: Object.fromEntries(translations.map((item) => [Number(item.languageId), item]))
    }
  });

  const handleAddTranslation = () => {
    hForm.setValue(`translations.${langId}`, {
      id: null,
      title: "",
      languageId: langId,
      description: "",
      readMoreText: ""
    });
    setTranslationSelected(langId);
  };

  const handleFormSubmit = async ({ translations, ...value }) => {
    const payload = {
      translations: Object.values(translations),
      color: color,
      bgColor: bgColor,
      ...value
    };
    const { success, data } =
      galleryId == -1
        ? await axEditHomePageGallery(Number(editGalleryData.sliderId), payload)
        : await axMiniEditHomePageGallery(Number(editGalleryData.sliderId), payload);

    if (success) {
      notification(t("group:homepage_customization.update.success"), NotificationType.Success);
      setGalleryList(galleryId == -1 ? data.gallerySlider : data.miniGallery[index].gallerySlider);
      setIsEdit(false);
    } else {
      notification(t("group:homepage_customization.update.failure"), NotificationType.Success);
    }
  };

  return (
    <FormProvider {...hForm}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button m={3} type="button" onClick={() => setIsEdit(false)} variant={"subtle"}>
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
        <TextBoxField
          key={`title-${translationSelected}`}
          name={`translations.${translationSelected}.title`}
          isRequired={true}
          label={
            translationSelected != SITE_CONFIG.LANG.DEFAULT_ID
              ? hForm.getValues().translations[SITE_CONFIG.LANG.DEFAULT_ID].title
              : t("group:homepage_customization.resources.title")
          }
          {...(galleryId && { maxLength: 2 })}
        />
        <TextBoxField
          name="moreLinks"
          label={t("group:homepage_customization.resources.link")}
          disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
        />
        {observationId ? (
          <>
            <p> {t("group:homepage_customization.resources.observation_image_not_editable")} </p>
            <Image
              src={getResourceThumbnail(
                RESOURCE_CTX.OBSERVATION,
                fileName,
                RESOURCE_SIZE.LIST_THUMBNAIL
              )}
            />
          </>
        ) : (
          <ImageUploaderField
            label={t("group:homepage_customization.resources.imageurl")}
            name="fileName"
            disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
          />
        )}
        <TextAreaField
          key={`description-${translationSelected}`}
          name={`translations.${translationSelected}.description`}
          label={t("group:homepage_customization.table.description")}
        />

        <TextBoxField
          key={`readMoreText-${translationSelected}`}
          name={`translations.${translationSelected}.readMoreText`}
          label={t("group:homepage_customization.resources.read_more")}
          maxLength={30}
        />

        <SelectInputField
          name="readMoreUIType"
          label={t("group:homepage_customization.resources.read_more_ui")}
          options={readMoreUIOptions}
          shouldPortal={true}
          disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
        />

        {galleryId == -1 && (
          <SelectInputField
            name="gallerySidebar"
            label={t("group:homepage_customization.resources.gallery_sidebar")}
            options={gallerySidebarBackgroundOptions}
            shouldPortal={true}
            disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
          />
        )}

        {galleryId != -1 && (
          <>
            <ColorPicker.Root
              defaultValue={parseColor(color)}
              maxW="200px"
              onValueChange={(v) => setColor(v.valueAsString)}
              mb={4}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>
                {t("group:homepage_customization.resources.text_color")}
              </ColorPicker.Label>
              <ColorPicker.Control>
                <ColorPicker.Trigger p="2">
                  <ColorPicker.ValueSwatch boxSize="8" />
                </ColorPicker.Trigger>
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="sm" variant="outline" />
                      <ColorPicker.Sliders />
                      <ColorPicker.ValueSwatch />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>

            <ColorPicker.Root
              defaultValue={parseColor(bgColor)}
              maxW="200px"
              onValueChange={(v) => setBgColor(v.valueAsString)}
              mb={4}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>
                {t("group:homepage_customization.resources.background_color")}
              </ColorPicker.Label>
              <ColorPicker.Control>
                <ColorPicker.Trigger p="2">
                  <ColorPicker.ValueSwatch boxSize="8" />
                </ColorPicker.Trigger>
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="sm" variant="outline" />
                      <ColorPicker.Sliders />
                      <ColorPicker.ValueSwatch />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>
          </>
        )}

        <CheckboxField
          name="truncated"
          label={t("group:homepage_customization.table.enabled")}
          disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
        />

        <SubmitButton>{t("common:update")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
