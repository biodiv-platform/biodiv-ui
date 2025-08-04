import {
  Box,
  Button,
  ColorPicker,
  HStack,
  Image,
  parseColor,
  Portal
} from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import { galleryFieldValidationSchema } from "@components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-form/common";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
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
    { label: "link", value: "link" },
    { label: "button", value: "button" }
  ];

  const gallerySidebarBackgroundOptions = [
    { label: "opaque", value: "opaque" },
    { label: "translucent", value: "translucent" }
  ];

  const { languageId } = useGlobalState();
  const [translationSelected, setTranslationSelected] = useState<number>(
    Number(Object.keys(editGalleryData[1])[0])
  );
  const [langId, setLangId] = useState(0);

  const validationSchema = Yup.lazy((value) => {
    const languageMapShape: Record<string, Yup.ArraySchema<any>> = {};

    for (const langId in value || {}) {
      languageMapShape[langId] = Yup.array().of(galleryFieldValidationSchema);
    }

    return Yup.object().shape(languageMapShape);
  });
  const [color, setColor] = useState(
    editGalleryData[1][205][0].color ? editGalleryData[1][205][0].color : "rgba(255,255,255,1)"
  );
  const [bgColor, setBgColor] = useState(
    editGalleryData[1][205][0].bgColor ? editGalleryData[1][205][0].bgColor : "rgba(26, 32, 44, 1)"
  );

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    context: { isVertical: vertical },
    defaultValues: editGalleryData[1]
  });

  if (Object.keys(hForm.getValues()).includes(languageId)) {
    setTranslationSelected(languageId);
  }

  const handleAddTranslation = () => {
    hForm.setValue(`${langId}`, [
      {
        authorId: editGalleryData[1][translationSelected][0].authorId,
        authorImage: editGalleryData[1][translationSelected][0].authorImage,
        authorName: editGalleryData[1][translationSelected][0].authorName,
        customDescripition: "",
        displayOrder: editGalleryData[1][translationSelected][0].displayOrder,
        fileName: editGalleryData[1][translationSelected][0].fileName,
        gallerySidebar: editGalleryData[1][translationSelected][0].gallerySidebar,
        id: null,
        languageId: langId,
        moreLinks: editGalleryData[1][translationSelected][0].moreLinks,
        observationId: editGalleryData[1][translationSelected][0].observationId,
        readMoreText: null,
        readMoreUIType: editGalleryData[1][translationSelected][0].readMoreUIType,
        sliderId: Number(editGalleryData[0].split("|")[0]),
        title: "",
        truncated: editGalleryData[1][translationSelected][0].truncated,
        ugId: editGalleryData[1][translationSelected][0].ugId
      }
    ]);
    setTranslationSelected(langId);
  };

  const handleFormSubmit = async (value) => {
    const payload = Object.fromEntries(
      Object.entries(value as Record<number, any[]>).map(([langId, entries]) => [
        langId,
        entries.map((entry) => ({
          ...entry,
          color: color,
          bgColor: bgColor
        }))
      ])
    );
    const { success, data } =
      galleryId == -1
        ? await axEditHomePageGallery(Number(editGalleryData[0].split("|")[0]), payload)
        : await axMiniEditHomePageGallery(Number(editGalleryData[0].split("|")[0]), payload);

    if (success) {
      notification(t("group:homepage_customization.update.success"), NotificationType.Success);
      setGalleryList(
        galleryId == -1
          ? Object.entries(data?.gallerySlider || {}).sort((a, b) => {
              const aOrder = parseInt(a[0].split("|")[1], 10);
              const bOrder = parseInt(b[0].split("|")[1], 10);
              return aOrder - bOrder;
            })
          : Object.entries(data?.miniGallerySlider[index] || {}).sort((a, b) => {
              const aOrder = parseInt(a[0].split("|")[1], 10);
              const bOrder = parseInt(b[0].split("|")[1], 10);
              return aOrder - bOrder;
            })
      );
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
        values={Object.keys(hForm.getValues())}
        setLangId={setLangId}
        languages={languages}
        handleAddTranslation={handleAddTranslation}
        translationSelected={translationSelected}
        setTranslationSelected={setTranslationSelected}
      />
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
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
        <TextBoxField
          key={`moreLinks-${translationSelected}`}
          name={`${translationSelected}.0.moreLinks`}
          label={t("group:homepage_customization.resources.link")}
          disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
          onChangeCallback={(e) => {
            const values = hForm.getValues();

            for (const langId in values) {
              const entry = values[langId]?.[0];
              if (entry) {
                hForm.setValue(`${langId}.0.moreLinks`, e.target.value);
              }
            }
          }}
        />
        {hForm.getValues()[translationSelected][0].observationId ? (
          <>
            <p> {t("group:homepage_customization.resources.observation_image_not_editable")} </p>
            <Image
              src={getResourceThumbnail(
                RESOURCE_CTX.OBSERVATION,
                hForm.getValues()[translationSelected][0].fileName,
                RESOURCE_SIZE.LIST_THUMBNAIL
              )}
            />
          </>
        ) : (
          <ImageUploaderField
            label={t("group:homepage_customization.resources.imageurl")}
            name={`${translationSelected}.0.fileName`}
            onChangeCallback={(value) => {
              const values = hForm.getValues();

              for (const langId in values) {
                const entry = values[langId]?.[0];
                if (entry) {
                  hForm.setValue(`${langId}.0.fileName`, value);
                }
              }
            }}
          />
        )}
        <TextAreaField
          key={`description-${translationSelected}`}
          name={`${translationSelected}.0.customDescripition`}
          label={t("group:homepage_customization.table.description")}
        />

        <TextBoxField
          key={`readMoreText-${translationSelected}`}
          name={`${translationSelected}.0.readMoreText`}
          label= {t("group:homepage_customization.resources.read_more")}
          maxLength={30}
        />

        <SelectInputField
          key={`readMoreUIType-${translationSelected}`}
          name={`${translationSelected}.0.readMoreUIType`}
          label={t("group:homepage_customization.resources.read_more_ui")}
          options={readMoreUIOptions}
          shouldPortal={true}
          disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
          onChangeCallback={(value) => {
            const values = hForm.getValues();

            for (const langId in values) {
              const entry = values[langId]?.[0];
              if (entry) {
                hForm.setValue(`${langId}.0.readMoreUIType`, value);
              }
            }
          }}
        />

        {galleryId == -1 && (
          <SelectInputField
            key={`gallerySidebar-${translationSelected}`}
            name={`${translationSelected}.0.gallerySidebar`}
            label= {t("group:homepage_customization.resources.gallery_sidebar")}
            options={gallerySidebarBackgroundOptions}
            shouldPortal={true}
            disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            onChangeCallback={(value) => {
              const values = hForm.getValues();

              for (const langId in values) {
                const entry = values[langId]?.[0];
                if (entry) {
                  hForm.setValue(`${langId}.0.gallerySidebar`, value);
                }
              }
            }}
          />
        )}

        {galleryId != -1 && (
          <>
            <ColorPicker.Root
              defaultValue={parseColor(color)}
              maxW="200px"
              onValueChange={(v) => setColor(v.valueAsString)}
              mb={4}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>{t("group:homepage_customization.resources.text_color")}</ColorPicker.Label>
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
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>{t("group:homepage_customization.resources.background_color")}</ColorPicker.Label>
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
          key={`truncated-${translationSelected}`}
          name={`${translationSelected}.0.truncated`}
          label={t("group:homepage_customization.table.enabled")}
          disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
          onChangeCallback={(value) => {
            const values = hForm.getValues();

            for (const langId in values) {
              const entry = values[langId]?.[0];
              if (entry) {
                hForm.setValue(`${langId}.0.truncated`, value);
              }
            }
          }}
        />

        <SubmitButton>{t("common:update")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
