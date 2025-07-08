import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  Tabs,
  useDisclosure
} from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
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
import Select from "react-select";
import * as Yup from "yup";

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
  const { isOpen, onClose, onOpen } = useDisclosure();

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
      setGalleryList(Object.entries(data?.gallerySlider || {}).sort((a, b) => {
        const aOrder = parseInt(a[0].split("|")[1], 10);
        const bOrder = parseInt(b[0].split("|")[1], 10);
        return aOrder - bOrder;
      }));
      setIsEdit(false);
    } else {
      notification(t("group:homepage_customization.update.failure"), NotificationType.Success);
    }
  };
  return (
    <FormProvider {...hForm}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button m={3} type="button" onClick={() => setIsEdit(false)} leftIcon={<ArrowBackIcon />}>
          {t("group:homepage_customization.back")}
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleAddTranslation();
              setLangId(0);
              onClose();
            }}
          >
            <ModalHeader> {t("common:create_form.add_translation_button")}</ModalHeader>
            <ModalBody>
              <Box>
                <FormControl mb={2} isRequired={true}>
                  <FormLabel htmlFor="name">{t("common:create_form.language")}</FormLabel>
                  {
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
                  }
                </FormControl>
              </Box>
            </ModalBody>
            <ModalFooter>
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
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Flex justify="flex-end" width="100%" mb={4} onClick={onOpen}>
        <Button colorScheme="green">{t("common:create_form.add_translation_button")}</Button>
      </Flex>
      <Tabs
        overflowX="auto"
        mb={4}
        variant="unstyled"
        bg="gray.100"
        rounded="md"
        index={Object.keys(hForm.getValues()).findIndex(
          (key) => key === translationSelected.toString()
        )}
        onChange={(index) => setTranslationSelected(Number(Object.keys(hForm.getValues())[index]))}
      >
        <TabList>
          {Object.keys(hForm.getValues()).map((language) => (
            <Tab
              key={language}
              _selected={{ bg: "white", borderRadius: "4", boxShadow: "lg" }}
              m={1}
            >
              {languages.filter((lang) => lang.id === Number(language))[0].name}
            </Tab>
          ))}
        </TabList>
      </Tabs>
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
          key={`links-${translationSelected}`}
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
          label="Read more button text"
          maxLength={30}
        />

        <SelectInputField
          key={`readmoreui-${translationSelected}`}
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
          key={`sidebar-${translationSelected}`}
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

        <SubmitButton>{t("common:update")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
