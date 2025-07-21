import {
  Box,
  Button,
  Flex,
  Image,
  Tabs,
  useDisclosure} from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import { galleryFieldValidationSchema } from "@components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-form/common";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import { axEditHomePageGallery } from "@services/utility.service";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import { NotificationType } from "@utils/notification";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import Select from "react-select";
import * as Yup from "yup";

import { DialogBackdrop, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";

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
  const { open, onClose, onOpen } = useDisclosure();

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

  const handleFormSubmit = async (payload) => {
    const { success, data } = await axEditHomePageGallery(
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
        <Button m={3} type="button" onClick={() => setIsEdit(false)} variant={"subtle"}>
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
                  label={t("traits:create_form.language")}
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
              <Button colorScheme="blue" type="submit">
                {t("common:create_form.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
      <Flex justify="flex-end" width="100%" mb={4} onClick={onOpen}>
        <Button colorScheme="green">{t("common:create_form.add_translation_button")}</Button>
      </Flex>
      <Tabs.Root
        overflowX="auto"
        mb={4}
        bg="gray.100"
        rounded="md"
        //index={Object.keys(hForm.getValues()).findIndex(
        //(key) => key === translationSelected.toString()
        //)}
        //onChange={(index) => setTranslationSelected(Number(Object.keys(hForm.getValues())[index]))}
      >
        <Tabs.List>
          {Object.keys(hForm.getValues()).map((language) => (
            <Tabs.Trigger
              key={language}
              value={language}
              _selected={{ bg: "white", borderRadius: "4", boxShadow: "lg" }}
              m={1}
            >
              {languages.filter((lang) => lang.id === Number(language))[0].name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
        <TextBoxField
          key={`title-${translationSelected}`}
          name={`${translationSelected}.0.title`}
          isRequired={true}
          label={
            translationSelected != languageId && hForm.getValues()[languageId]
              ? hForm.getValues()[languageId][0].title
              : t("group:homepage_customization.resources.title")
          }
        />
        <TextBoxField
          key={`moreLinks-${translationSelected}`}
          name={`${translationSelected}.0.moreLinks`}
          label={t("group:homepage_customization.resources.link")}
          disabled={hForm.getValues()[translationSelected][0].id == null}
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
          label="Read more button text"
          maxLength={30}
        />

        <SelectInputField
          key={`readMoreUIType-${translationSelected}`}
          name={`${translationSelected}.0.readMoreUIType`}
          label="Read more UI type"
          options={readMoreUIOptions}
          shouldPortal={true}
          disabled={hForm.getValues()[translationSelected][0].id == null}
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
          key={`gallerySidebar-${translationSelected}`}
          name={`${translationSelected}.0.gallerySidebar`}
          label="Gallery sidebar background"
          options={gallerySidebarBackgroundOptions}
          shouldPortal={true}
          disabled={hForm.getValues()[translationSelected][0].id == null}
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

        <CheckboxField
          key={`truncated-${translationSelected}`}
          name={`${translationSelected}.0.truncated`}
          label={t("group:homepage_customization.table.enabled")}
          disabled={hForm.getValues()[translationSelected][0].id == null}
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
