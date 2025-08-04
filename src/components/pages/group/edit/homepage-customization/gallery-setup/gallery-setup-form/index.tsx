import {
  Box,
  Button,
  ColorPicker,
  Flex,
  HStack,
  parseColor,
  Portal,
  Text
} from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
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
    { label: "link", value: "link" },
    { label: "button", value: "button" }
  ];
  const gallerySidebarBackgroundOptions = [
    { label: "opaque", value: "opaque" },
    { label: "translucent", value: "translucent" }
  ];
  const [imagePicker, setImagePicker] = useState<boolean>(true);
  const { languageId } = useGlobalState();
  const [defaultValues, setDefaultValues] = useState<IGallerySetupForm | any>(undefined);
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
    context: { isVertical: vertical },
    defaultValues: {
      [languageId]: group
        ? [
            {
              customDescripition: "",
              fileName: undefined,
              moreLinks: "",
              title: "",
              galleryId: galleryId
            }
          ]
        : [
            {
              customDescripition: "",
              fileName: undefined,
              moreLinks: "",
              title: "",
              truncated: true,
              galleryId: galleryId
            }
          ]
    }
  });

  const [langId, setLangId] = useState(0);
  const [color, setColor] = useState("rgba(255,255,255,1)");
  const [bgColor, setBgColor] = useState("rgba(26, 32, 44, 1)");

  const handleFormSubmit = (value) => {
    const payload = Object.fromEntries(
      Object.entries(value as Record<number, any[]>).map(([langId, entries]) => [
        langId,
        entries.map((entry) => ({
          ...entry,
          authorId: entry?.authorInfo?.id,
          authorName: entry?.authorInfo?.name,
          authorImage: entry?.authorInfo?.profilePic,
          galleryId: galleryId,
          color: color,
          bgColor: bgColor
        }))
      ])
    );
    setGalleryList([...galleryList, [`null|${galleryList.length}`, payload]]);
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
    hForm.setValue(`${langId}`, [
      {
        customDescripition: "",
        fileName: hForm.getValues()[translationSelected][0].fileName,
        moreLinks: hForm.getValues()[translationSelected][0].moreLinks,
        title: "",
        observationId: hForm.getValues()[translationSelected][0].observationId,
        readMoreText: null,
        readMoreUIType: hForm.getValues()[translationSelected][0].readMoreUIType,
        gallerySidebar: hForm.getValues()[translationSelected][0].gallerySidebar,
        authorInfo: hForm.getValues()[translationSelected][0].authorInfo,
        truncated: hForm.getValues()[translationSelected][0].truncated,
        options: hForm.getValues()[translationSelected][0].options
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
          <Flex alignItems="center">
            <Text m={3}>{t("group:homepage_customization.resources.new_image")}</Text>
            <Switch onChange={handleChange} colorPalette={"blue"} />
            <Text m={3}>{t("group:homepage_customization.resources.observation_image")}</Text>
          </Flex>
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
          {imagePicker ? (
            <NewResourceForm translation={translationSelected} />
          ) : (
            <ExsistingResourceForm
              defaultValues={defaultValues}
              setDefaultValues={setDefaultValues}
              translation={translationSelected}
            />
          )}
          <TextAreaField
            key={`decription-${translationSelected}`}
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
              key={`sidebar-${translationSelected}`}
              name={`${translationSelected}.0.gallerySidebar`}
              label={t("group:homepage_customization.resources.gallery_sidebar")}
              options={gallerySidebarBackgroundOptions}
              shouldPortal={true}
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

          {!group && (
            <CheckboxField
              key={`truncated-${translationSelected}`}
              name={`${translationSelected}.0.truncated`}
              label={t("group:homepage_customization.table.enabled")}
            />
          )}
          <SubmitButton>{t("group:homepage_customization.gallery_setup.create")}</SubmitButton>
        </form>
      </FormProvider>
    </>
  );
}
