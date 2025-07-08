import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure
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
import Select from "react-select";
import * as Yup from "yup";

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
}

export default function GallerySetupFrom({
  setIsCreate,
  galleryList,
  setGalleryList,
  languages,
  galleryId = null,
  group = true
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
    defaultValues: {
      [languageId]: group
        ? [{ customDescripition: "", fileName: undefined, moreLinks: "", title: "" }]
        : [{ customDescripition: "", fileName: undefined, moreLinks: "", title: "", truncated:true }]
    }
  });

  const [langId, setLangId] = useState(0);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleFormSubmit = (value) => {
    const payload = Object.fromEntries(
      Object.entries(value as Record<number, any[]>).map(([langId, entries]) => [
        langId,
        entries.map((entry) => ({
          ...entry,
          authorId: defaultValues?.[langId]?.[0]?.authorInfo?.id,
          authorName: defaultValues?.[langId]?.[0]?.authorInfo?.name,
          authorImage: defaultValues?.[langId]?.[0]?.authorInfo?.profilePic,
          galleryId: galleryId
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
          <Button
            m={3}
            type="button"
            onClick={() => setIsCreate(false)}
            leftIcon={<ArrowBackIcon />}
          >
            {t("group:homepage_customization.back")}
          </Button>
          <Flex alignItems="center">
            <Text m={3}>{t("group:homepage_customization.resources.new_image")}</Text>
            <Switch onChange={handleChange} />
            <Text m={3}>{t("group:homepage_customization.resources.observation_image")}</Text>
          </Flex>
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
          onChange={(index) =>
            setTranslationSelected(Number(Object.keys(hForm.getValues())[index]))
          }
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
            label="Read more button text"
            maxLength={30}
          />
          <SelectInputField
            key={`readmoreui-${translationSelected}`}
            name={`${translationSelected}.0.readMoreUIType`}
            label="Read more UI type"
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
          <SelectInputField
            key={`sidebar-${translationSelected}`}
            name={`${translationSelected}.0.gallerySidebar`}
            label="Gallery sidebar background"
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

          {!group && (
            <CheckboxField
              key = {`truncated-${translationSelected}`}
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
