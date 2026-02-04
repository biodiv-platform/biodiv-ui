import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  IconButton,
  Portal,
  Text,
  VStack
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { axUpdateSpeciesFieldTranslations } from "@services/species.service";
import { axGetLangList } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import ReactSelect from "react-select";
import * as Yup from "yup";

interface FieldTranslation {
  languageId: string;
  header: string;
  description: string;
  urlIdentifier: string;
}

interface TranslateFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: any;
  translations: FieldTranslation[];
  onSuccess: (translation: any) => void;
}

const TranslateFieldModal: React.FC<TranslateFieldModalProps> = ({
  isOpen,
  onClose,
  field,
  translations = [],
  onSuccess
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState(0);
  const [languages, setLanguages] = React.useState<Array<{ id: number; name: string }>>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = React.useState(false);
  const [englishPlaceholders, setEnglishPlaceholders] = React.useState({
    header: "",
    description: "",
    urlIdentifier: ""
  });

  const getFieldTypeLabel = () => {
    if (field?.type === "concept") return "concept";
    if (field?.type === "category") return "category";
    return "subcategory";
  };

  const fieldType = field ? getFieldTypeLabel() : "";

  const hForm = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        translations: Yup.array()
          .of(
            Yup.object().shape({
              languageId: Yup.number().required(t("form:required")),
              header: Yup.string().required(t("form:required")),
              description: Yup.string(),
              urlIdentifier: Yup.string()
            })
          )
          .min(1, t("form:at_least_one_translation"))
      })
    ),
    defaultValues: {
      translations: [
        {
          languageId: SITE_CONFIG.LANG.DEFAULT_ID, // Default language ID for French (since original is likely in English)
          header: "",
          description: "",
          urlIdentifier: ""
        }
      ]
    }
  });

  const {
    fields: formFields,
    append,
    remove,
    replace
  } = useFieldArray({
    control: hForm.control,
    name: "translations"
  });

  // Reset form when modal opens with new field
  useEffect(() => {
    if (isOpen && field) {
      // Keep only the first default translation
      while (hForm.getValues("translations").length > 1) {
        remove(1);
      }
      setActiveTab(0);
    }
  }, [isOpen, field, remove, hForm]);

  // Fetch languages when the modal opens
  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoadingLanguages(true);
      const response = await axGetLangList();
      if (response.success && response.data) {
        setLanguages(response.data);
      }
      setIsLoadingLanguages(false);
    };

    if (isOpen) {
      fetchLanguages();
    }
  }, [isOpen]);

  // Pre-populate form with existing translations when they become available
  useEffect(() => {
    if (translations?.length > 0) {
      const formattedTranslations = translations.map((translation) => ({
        languageId: parseInt(translation.languageId),
        header: translation.header,
        description: translation.description,
        urlIdentifier: translation.urlIdentifier
      }));

      replace(formattedTranslations);
      setActiveTab(0);
    }
  }, [translations, replace]);

  const handleSubmit = async (values) => {
    if (!field) return;

    try {
      const formattedTranslations = {
        fieldId: field.id,
        translations: values.translations.map((translation) => ({
          langId: translation.languageId,
          header: translation.header,
          description: translation.description,
          urlIdentifier: translation.urlIdentifier
        }))
      };

      const response = await axUpdateSpeciesFieldTranslations([formattedTranslations]);

      if (response.success) {
        // Pass the complete translation data to the parent component
        // This will allow the parent to update tabs immediately
        const newTranslations = values.translations.map((translation) => ({
          languageId: translation.languageId,
          header: translation.header,
          description: translation.description,
          urlIdentifier: translation.urlIdentifier
        }));

        onSuccess(newTranslations);
        hForm.reset();
        onClose();
      } else {
        notification(t("admin:species_fields.translation_save_error"), NotificationType.Error);
      }
    } catch (error) {
      console.error("Error saving translation:", error);
      notification(t("admin:species_fields.translation_save_error"), NotificationType.Error);
    }
  };

  if (!field) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} size="xl">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <FormProvider {...hForm}>
              <form onSubmit={hForm.handleSubmit(handleSubmit)}>
                <Dialog.Header fontSize={"xl"} fontWeight={"bold"}>
                  {t("admin:species_fields.translate")} {fieldType}
                </Dialog.Header>
                <Dialog.CloseTrigger />
                <Dialog.Body>
                  {/* Original Field Information (Read-only) */}
                  <Box p={4} mb={4} bg="blue.50" borderRadius="md">
                    <VStack align="stretch" gap={3}>
                      <Box>
                        <Text fontWeight="medium">
                          {t(`admin:species_fields.${fieldType}_name`)}
                        </Text>
                        <Text>{field.name}</Text>
                      </Box>
                      {field.description && (
                        <Box>
                          <Text fontWeight="medium">{t("admin:species_fields.description")}</Text>
                          <Text>{field.description}</Text>
                        </Box>
                      )}
                      {field.urlIdentifier && (
                        <Box>
                          <Text fontWeight="medium">
                            {t("admin:species_fields.url_identifier")}
                          </Text>
                          <Text>{field.urlIdentifier}</Text>
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  {/* Add Translation Button */}
                  <Flex justify="flex-end" mb={4}>
                    <Button
                      size="sm"
                      variant={"subtle"}
                      onClick={() => {
                        // Find the English translation data (assuming English languageId is 38)
                        const englishTranslation = hForm
                          .getValues("translations")
                          .find((t) => t.languageId === SITE_CONFIG.LANG.DEFAULT_ID);

                        // Set empty values but store English values to use as placeholders later
                        append({
                          languageId: SITE_CONFIG.LANG.DEFAULT_ID, // Default to French for new translations
                          header: "",
                          description: "",
                          urlIdentifier: ""
                        });

                        // Store English values in React state instead of form
                        if (englishTranslation) {
                          setEnglishPlaceholders({
                            header: englishTranslation.header || "",
                            description: englishTranslation.description || "",
                            urlIdentifier: englishTranslation.urlIdentifier || ""
                          });
                        }

                        setActiveTab(formFields.length);
                      }}
                    >
                      <LuPlus />
                      {t("admin:species_fields.add_translation")}
                    </Button>
                  </Flex>

                  {/* Language Tabs */}
                  <Flex mb={4} flexWrap="wrap" gap={2}>
                    {formFields.map((field, index) => (
                      <Button
                        key={field.id}
                        size="sm"
                        variant={activeTab === index ? "subtle" : "outline"}
                        onClick={() => setActiveTab(index)}
                      >
                        {languages.find(
                          (lang) => lang.id === hForm.watch(`translations.${index}.languageId`)
                        )?.name || t("admin:species_fields.language")}
                        {index > 0 && (
                          <IconButton
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(index);
                              if (activeTab >= index) {
                                setActiveTab(Math.max(0, activeTab - 1));
                              }
                            }}
                            ml={2}
                            aria-label="Remove translation"
                            variant={"subtle"}
                          >
                            <LuTrash2 />
                          </IconButton>
                        )}
                      </Button>
                    ))}
                  </Flex>

                  {/* Active Translation Form */}
                  {formFields.map((formField, index) => (
                    <Box
                      key={formField.id}
                      display={activeTab === index ? "block" : "none"}
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                    >
                      <Text mb={1} fontWeight="medium">
                        {t("admin:species_fields.language")}{" "}
                        <Box as="span" color="red.500">
                          *
                        </Box>
                      </Text>
                      <Box mb={6}>
                        <ReactSelect
                          name={`translations.${index}.languageId`}
                          placeholder={t("admin:species_fields.language")}
                          options={languages.map((lang) => ({ value: lang.id, label: lang.name }))}
                          isLoading={isLoadingLanguages}
                          value={
                            languages.find(
                              (lang) => lang.id === hForm.watch(`translations.${index}.languageId`)
                            )
                              ? {
                                  value: hForm.watch(`translations.${index}.languageId`),
                                  label: languages.find(
                                    (lang) =>
                                      lang.id === hForm.watch(`translations.${index}.languageId`)
                                  )?.name
                                }
                              : null
                          }
                          onChange={(option) => {
                            if (option) {
                              hForm.setValue(`translations.${index}.languageId`, option.value);
                            }
                          }}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </Box>

                      <TextBoxField
                        name={`translations.${index}.header`}
                        label={t(`admin:species_fields.${fieldType}_name`)}
                        isRequired={true}
                        placeholder={index > 0 ? englishPlaceholders.header : ""}
                      />

                      <TextBoxField
                        name={`translations.${index}.description`}
                        label={t("admin:species_fields.description")}
                        isRequired={false}
                        placeholder={index > 0 ? englishPlaceholders.description : ""}
                      />

                      <TextBoxField
                        name={`translations.${index}.urlIdentifier`}
                        label={t("admin:species_fields.url_identifier")}
                        isRequired={false}
                        placeholder={index > 0 ? englishPlaceholders.urlIdentifier : ""}
                      />
                    </Box>
                  ))}
                </Dialog.Body>

                <Dialog.Footer>
                  <SubmitButton leftIcon={<CheckIcon />} mr={3}>
                    {t("common:save")}
                  </SubmitButton>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="subtle"> {t("common:cancel")}</Button>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
              </form>
            </FormProvider>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default TranslateFieldModal;
