import { Box, Button, ColorPicker, Flex, HStack, parseColor, Portal, Text } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import * as Yup from "yup";

import TranslationTab from "@/components/pages/common/translation-tab";
import { Switch } from "@/components/ui/switch";

import { galleryFieldValidationSchema } from "./common";
import ExsistingResourceForm from "./exsisting-resource-form";
import NewResourceForm from "./new-resource-form";

interface IGallerySetupForm {
  title: string;
  customDescripition: string;
  fileName: string;
  moreLinks: string;
  observationId: number;
  authorId?: string;
  authorName?: string;
  profilePic?: string;
  options?: any[];
  truncated?: boolean;
  galleryId?: number;
  index?: number;
}

export default function GallerySetupFrom({
  setIsCreate,
  galleryList,
  setGalleryList,
  languages,
  galleryId = -1,
  group = true,
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
  const [imagePicker, setImagePicker] = useState<boolean>(true);
  const { languageId } = useGlobalState();
  const [defaultValues, setDefaultValues] = useState<IGallerySetupForm | any>(undefined);
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
      translations: {
        [SITE_CONFIG.LANG.DEFAULT_ID]: {
          title: "",
          languageId: SITE_CONFIG.LANG.DEFAULT_ID,
          description: "",
          readMoreText: ""
        }
      },
      customDescripition: "",
      fileName: undefined,
      moreLinks: "",
      title: "h",
      truncated: true,
      galleryId: galleryId
    }
  });

  const [langId, setLangId] = useState(0);
  const [color, setColor] = useState("rgba(255,255,255,1)");
  const [bgColor, setBgColor] = useState("rgba(26, 32, 44, 1)");

  const handleFormSubmit = ({ translations, title, customDescripition, ...value }) => {
    const payload = {
      translations: Object.values(translations),
      authorId: value?.authorInfo?.id,
      authorName: value?.authorInfo?.name,
      authorImage: value?.authorInfo?.profilePic,
      galleryId: galleryId,
      color: color,
      bgColor: bgColor,
      title: translations[SITE_CONFIG.LANG.DEFAULT_ID].title,
      customDescripition: translations[SITE_CONFIG.LANG.DEFAULT_ID].description,
      ...value
    };
    setGalleryList([...galleryList, payload]);
    setIsCreate(false);
  };

  const handleChange = () => {
    setImagePicker(!imagePicker);
  };

  useEffect(() => {
    hForm.reset(defaultValues);
  }, [defaultValues]);

  const [translationSelected, setTranslationSelected] = useState<number>(languageId);

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

  return (
    <>
      <FormProvider {...hForm}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button m={3} type="button" onClick={() => setIsCreate(false)} variant={"subtle"}>
            <LuArrowLeft />
            {t("group:homepage_customization.back")}
          </Button>
          <Flex alignItems="center">
            <Text m={3}>{t("group:homepage_customization.resources.new_image")}</Text>
            <Switch onChange={handleChange} colorPalette={"blue"} />
            <Text m={3}>{t("group:homepage_customization.resources.observation_image")}</Text>
          </Flex>
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
          {imagePicker ? (
            <NewResourceForm translation={translationSelected} galleryId={galleryId} />
          ) : (
            <ExsistingResourceForm
              defaultValues={defaultValues}
              setDefaultValues={setDefaultValues}
              translation={translationSelected}
              galleryId={galleryId}
            />
          )}
          <TextAreaField
            key={`decription-${translationSelected}`}
            name={`translations.${translationSelected}.description`}
            label={t("group:homepage_customization.table.description")}
            {...(galleryId != -1 && { maxLength: vertical ? 85 : 275 })}
          />
          <TextBoxField
            key={`readmore-${translationSelected}`}
            name={`translations.${translationSelected}.readMoreText`}
            label={t("group:homepage_customization.resources.read_more")}
            maxLength={galleryId != -1 ? (vertical ? 10 : 20) : 30}
          />
          <SelectInputField
            key={`readmoreui`}
            name={`readMoreUIType`}
            label={t("group:homepage_customization.resources.read_more_ui")}
            options={readMoreUIOptions}
            disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            shouldPortal={true}
          />
          {galleryId == -1 && (
            <SelectInputField
              key={`sidebar`}
              name={`gallerySidebar`}
              label={t("group:homepage_customization.resources.gallery_sidebar")}
              options={gallerySidebarBackgroundOptions}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
              shouldPortal={true}
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

          {!group && (
            <CheckboxField
              key={`truncated`}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
              name={`truncated`}
              label={t("group:homepage_customization.table.enabled")}
            />
          )}
          <SubmitButton>{t("group:homepage_customization.gallery_setup.create")}</SubmitButton>
        </form>
      </FormProvider>
    </>
  );
}
