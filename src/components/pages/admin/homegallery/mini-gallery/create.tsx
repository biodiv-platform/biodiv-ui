import { Box, Button, Flex, Tabs, useDisclosure } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import Select from "react-select";
import * as Yup from "yup";

import { NumberInputField } from "@/components/form/number-input";
import { RadioInputField } from "@/components/form/radio";
import { TextBoxField } from "@/components/form/text";
import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import useGlobalState from "@/hooks/use-global-state";
import { axCreateMiniGallery } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

export const SLIDER_TYPE = [
  {
    label: "Horizontal Slide (Slides move left and right)",
    value: "false"
  },
  {
    label: "Vertical Slide (Slides move up and down)",
    value: "true"
  }
];

export default function CreateMiniGalleryForm({
  setIsCreate,
  miniGalleryList,
  setMiniGalleryList,
  languages,
  sliderList,
  setSliderList
}) {
  const { t } = useTranslation();

  const { languageId } = useGlobalState();
  const [translationSelected, setTranslationSelected] = useState<number>(languageId);
  const [langId, setLangId] = useState(0);
  const { open, onClose, onOpen } = useDisclosure();

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
      [languageId]: [
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
      setMiniGalleryList([...miniGalleryList, ...Object.entries(data)]);
      setSliderList([...sliderList,[]])
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
        <DialogRoot open={open} onOpenChange={onClose}>
          <DialogBackdrop />
          <DialogContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleAddTranslation();
                setLangId(0);
                onClose();
              }}
            >
              <DialogHeader> {t("common:create_form.add_translation_button")}</DialogHeader>
              <DialogBody>
                <Box>
                  <Field
                    mb={2}
                    required={true}
                    htmlFor="name"
                    label={t("common:create_form.language")}
                  >
                    <Select
                      id="langId"
                      inputId="langId"
                      name="langId"
                      placeholder={t("common:create_form.language_placeholder")}
                      onChange={(o: { value: number; label: string }) => {
                        setLangId(o.value);
                      }}
                      components={{
                        IndicatorSeparator: () => null
                      }}
                      options={languages
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((lang) => ({
                          value: lang.id,
                          label: lang.name
                        }))}
                      isSearchable={true} // Enables search
                    />
                  </Field>
                </Box>
              </DialogBody>
              <DialogFooter>
                <Button
                  mr={3}
                  onClick={() => {
                    setLangId(0);
                    onClose();
                  }}
                >
                  {t("common:create_form.cancel")}
                </Button>
                <Button colorPalette="blue" type="submit">
                  {t("common:create_form.create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogRoot>
        <Flex justify="flex-end" width="100%" mb={4} onClick={onOpen}>
          <Button colorPalette="green">{t("common:create_form.add_translation_button")}</Button>
        </Flex>
        <Tabs.Root
          overflowX="auto"
          mb={4}
          bg="gray.100"
          rounded="md"
          variant="plain"
          value={translationSelected.toString()}
          onValueChange={({ value }) => setTranslationSelected(Number(value))}
        >
          <Tabs.List>
            {Object.keys(hForm.getValues()).map((language) => (
              <Tabs.Trigger
                key={language}
                value={language.toString()}
                _selected={{ bg: "white", borderRadius: "4", boxShadow: "lg" }}
                m={1}
              >
                {languages.filter((lang) => lang.id === Number(language))[0].name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
        <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
          <Box m={3}>
            <TextBoxField
              key={`title-${translationSelected}`}
              name={`${translationSelected}.0.title`}
              isRequired={true}
              label={t("group:homepage_customization.resources.title")}
            />
            <RadioInputField
              key={`isVertical-${translationSelected}`}
              name={`${translationSelected}.0.isVertical`}
              label={t("group:homepage_customization.mini_gallery_setup.vertical_label")}
              options={SLIDER_TYPE}
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
