import { Box, Button, Image } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import { axEditGroupHomePageGallery } from "@services/usergroup.service";
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

import { galleryFieldValidationSchema } from "./common";

export default function GalleryEditForm({ setIsEdit, setGalleryList, editGalleryData, languages }) {
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

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: editGalleryData[1]
  });

  const imgUrl = getResourceThumbnail(
    RESOURCE_CTX.OBSERVATION,
    editGalleryData[1][Object.keys(editGalleryData[1])[0]][0].fileName,
    RESOURCE_SIZE.LIST_THUMBNAIL
  );

  if (Object.keys(hForm.getValues()).includes(languageId)) {
    setTranslationSelected(languageId);
  }

  const handleAddTranslation = () => {
    setTranslationSelected(langId);
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
        ugId: editGalleryData[1][translationSelected][0].ugId
      }
    ]);
  };

  const handleFormSubmit = async (payload) => {
    const { success, data } = await axEditGroupHomePageGallery(
      editGalleryData[1][Object.keys(editGalleryData[1])[0]][0].ugId,
      Number(editGalleryData[0].split("|")[0]),
      payload
    );

    if (success) {
      notification(t("group:homepage_customization.update.success"), NotificationType.Success);
      setGalleryList(
        Object.entries(data?.gallerySlider || {}).sort((a, b) => {
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
        <Button m={3} type="button" onClick={() => setIsEdit(false)}>
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
              ? hForm.getValues()[languageId][0].title
              : t("group:homepage_customization.resources.title")
          }
        />
        <TextBoxField
          key={`links-${translationSelected}`}
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
            <Image src={imgUrl} />
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
          key={`readmore-${translationSelected}`}
          name={`${translationSelected}.0.readMoreText`}
          label={t("group:homepage_customization.resources.read_more")}
          maxLength={30}
        />

        <SelectInputField
          key={`readmoreui-${translationSelected}`}
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

        <SelectInputField
          key={`sidebar-${translationSelected}`}
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

        <SubmitButton>{t("common:update")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
