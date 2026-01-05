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
import GallerySetupFrom from "@/components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-form";
import GroupGalleryEditForm from "@/components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-form/editform";
import GroupGallerySetupTable from "@/components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-tabel";
import { axEditMiniGroupGallery } from "@/services/usergroup.service";
import { axEditMiniGallery } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

import GalleryEditForm from "../gallery-setup/gallery-setup-form/editform";
import GallerySetupTable from "../gallery-setup/gallery-setup-tabel";

export default function EditMiniGalleryForm({
  setIsEdit,
  editGalleryData,
  miniGalleryList,
  setMiniGalleryList,
  index,
  languages,
  groupId,
  item,
  miniGallery,
  setMiniGallery,
  handleItemFormSubmit
}) {
  const { t } = useTranslation();
  const {
    isActive,
    isVertical,
    slidesPerView,
    translations,
    id,
    title,
    languageId,
    galleryId,
    ugId
  } = editGalleryData;

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

  const [translationSelected, setTranslationSelected] = useState<number>(
    SITE_CONFIG.LANG.DEFAULT_ID
  );
  const [langId, setLangId] = useState(0);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        translations: Yup.lazy((value) => {
          const shape: Record<string, any> = {};

          for (const langId in value || {}) {
            shape[langId] = Yup.object().shape({
              title: Yup.string().required("Title is required"),
              languageId: Yup.number()
            });
          }

          return Yup.object().shape(shape);
        }),
        isActive: Yup.boolean(),
        isVertical: Yup.boolean(),
        slidesPerView: Yup.string()
      })
    ),
    defaultValues: {
      isActive,
      isVertical: isVertical.toString(),
      slidesPerView,
      translations: Object.fromEntries(translations.map((item) => [Number(item.languageId), item])),
      id,
      title,
      languageId,
      galleryId,
      ugId
    }
  });

  const handleAddTranslation = () => {
    hForm.setValue(`translations.${langId}`, {
      id: null,
      title: "",
      languageId: langId
    });
    setTranslationSelected(langId);
  };

  const handleFormSubmit = async (value) => {
    const payload = {
      ...value,
      slidesPerView: Number(value.slidesPerView),
      isVertical: Boolean(value.isVertical),
      translations: Object.values(value.translations)
    };
    const { success, data } =
      groupId == -1
        ? await axEditMiniGallery(editGalleryData.galleryId, payload)
        : await axEditMiniGroupGallery(groupId, editGalleryData.galleryId, payload);
    if (success) {
      notification(
        t("group:homepage_customization.mini_gallery_setup.edit_success"),
        NotificationType.Success
      );
      const gallerySlider = miniGalleryList[index].gallerySlider;
      miniGalleryList[index] = data;
      miniGalleryList[index].gallerySlider = gallerySlider;
      handleItemFormSubmit();
      setMiniGalleryList(miniGalleryList);
      setIsEdit(false);
    } else {
      notification(
        t("group:homepage_customization.mini_gallery_setup.edit_error"),
        NotificationType.Error
      );
    }
  };

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setItemsEdit] = useState(false);
  const [editData, setEditData] = useState(item.gallerySlider);
  const [galleryList, setGalleryList] = useState(item.gallerySlider);

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
            <SwitchField
              key={`isActive`}
              name={`isActive`}
              label={t("group:homepage_customization.mini_gallery_setup.active_label")}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            />
            <NumberInputField
              key={`slidesPerView`}
              name={`slidesPerView`}
              label={t("group:homepage_customization.mini_gallery_setup.slides_per_view")}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            />
          </Box>
        </form>
      </FormProvider>
      <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
        {isEdit ? (
          groupId == -1 ? (
            <GalleryEditForm
              setIsEdit={setItemsEdit}
              setGalleryList={(v) => {
                setGalleryList(v);
                miniGallery[index].gallerySlider = v;
                setMiniGallery(miniGallery);
              }}
              editGalleryData={editData}
              languages={languages}
              galleryId={Number(item.galleryId)}
              index={index}
              vertical={item.isVertical}
            />
          ) : (
            <GroupGalleryEditForm
              setIsEdit={setItemsEdit}
              setGalleryList={(v) => {
                setGalleryList(v);
                miniGallery[index].gallerySlider = v;
                setMiniGallery(miniGallery);
              }}
              editGalleryData={editData}
              languages={languages}
              galleryId={Number(item.galleryId)}
              index={index}
              vertical={item.isVertical}
            />
          )
        ) : isCreate ? (
          <GallerySetupFrom
            setIsCreate={setIsCreate}
            galleryList={galleryList}
            setGalleryList={(v) => {
              setGalleryList(v);
              miniGallery[index].gallerySlider = v;
              setMiniGallery(miniGallery);
            }}
            languages={languages}
            group={false}
            galleryId={Number(item.galleryId)}
            vertical={item.isVertical}
          />
        ) : groupId == -1 ? (
          <GallerySetupTable
            setIsCreate={setIsCreate}
            setGalleryList={(v) => {
              setGalleryList(v);
              miniGallery[index].gallerySlider = v;
              setMiniGallery(miniGallery);
            }}
            galleryList={galleryList}
            setIsEdit={setItemsEdit}
            setEditGalleryData={setEditData}
            galleryId={item.galleryId}
          />
        ) : (
          <GroupGallerySetupTable
            setIsCreate={setIsCreate}
            setGalleryList={(v) => {
              setGalleryList(v);
              miniGallery[index].gallerySlider = v;
              setMiniGallery(miniGallery);
            }}
            galleryList={galleryList}
            setIsEdit={setItemsEdit}
            setEditGalleryData={setEditData}
            galleryId={item.galleryId}
            userGroupId={item.galleryId ? groupId : null}
          />
        )}
      </Box>

      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
          <SubmitButton>{t("common:update")}</SubmitButton>
        </form>
      </FormProvider>
    </>
  );
}
