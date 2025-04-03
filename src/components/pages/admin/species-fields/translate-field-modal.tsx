import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { axUpdateSpeciesFieldTranslations } from "@services/species.service";
import { axGetLangList } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import * as Yup from "yup";

interface TranslateFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: any;
}

const TranslateFieldModal: React.FC<TranslateFieldModalProps> = ({ isOpen, onClose, field }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState(0);
  const [languages, setLanguages] = React.useState<Array<{id: number, name: string}>>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = React.useState(false);
  
  const getFieldTypeLabel = () => {
    if (field?.type === "concept") return "concept";
    if (field?.type === "category") return "category";
    return "subcategory";
  };

  const fieldType = field ? getFieldTypeLabel() : "";

  const hForm = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        translations: Yup.array().of(
          Yup.object().shape({
            languageId: Yup.number().required(t("form:required")),
            header: Yup.string().required(t("form:required")),
            description: Yup.string().required(t("form:required")),
            urlIdentifier: Yup.string().required(t("form:required"))
          })
        ).min(1, t("form:at_least_one_translation"))
      })
    ),
    defaultValues: {
      translations: [
        {
          languageId: 219, // Default language ID for French (since original is likely in English)
          header: "",
          description: "",
          urlIdentifier: ""
        }
      ]
    }
  });

  const { fields: formFields, append, remove } = useFieldArray({
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

  const handleSubmit = async (values) => {
    if (!field) return;
    
    try {
      const formattedTranslations = {
        fieldId: field.id,
        translations: values.translations.map(translation => ({
          langId: translation.languageId,
          header: translation.header,
          description: translation.description,
          urlIdentifier: translation.urlIdentifier
        }))
      };

      await axUpdateSpeciesFieldTranslations([formattedTranslations]);
      notification(t("admin:species_fields.translations_saved"), NotificationType.Success);
      hForm.reset();
      onClose();
    } catch (error) {
      console.error("Error saving translations:", error);
      notification(t("admin:species_fields.save_error"), NotificationType.Error);
    }
  };

  if (!field) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...hForm}>
          <form onSubmit={hForm.handleSubmit(handleSubmit)}>
            <ModalHeader>
              {t("admin:species_fields.translate")} {fieldType}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Original Field Information (Read-only) */}
              <Box p={4} mb={4} bg="blue.50" borderRadius="md">
                {/* <Text fontWeight="bold" mb={2}>{t("admin:species_fields.original_text")}</Text> */}
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontWeight="medium">{t(`admin:species_fields.${fieldType}_name`)}</Text>
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
                      <Text fontWeight="medium">{t("admin:species_fields.url_identifier")}</Text>
                      <Text>{field.urlIdentifier}</Text>
                    </Box>
                  )}
                </VStack>
              </Box>
              
              {/* Add Translation Button */}
              <Flex justify="flex-end" mb={4}>
                <Button
                  size="sm"
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    append({
                      languageId: 219, // Default to French for new translations
                      header: "",
                      description: "",
                      urlIdentifier: ""
                    });
                    setActiveTab(formFields.length);
                  }}
                >
                  {t("admin:species_fields.add_translation")}
                </Button>
              </Flex>

              {/* Language Tabs */}
              <Flex mb={4} flexWrap="wrap" gap={2}>
                {formFields.map((field, index) => (
                  <Button
                    key={field.id}
                    size="sm"
                    variant={activeTab === index ? "solid" : "outline"}
                    onClick={() => setActiveTab(index)}
                  >
                    {languages.find(lang => lang.id === hForm.watch(`translations.${index}.languageId`))?.name || t("admin:species_fields.language")}
                    {index > 0 && (
                      <IconButton
                        size="xs"
                        icon={<DeleteIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(index);
                          if (activeTab >= index) {
                            setActiveTab(Math.max(0, activeTab - 1));
                          }
                        }}
                        ml={2}
                        aria-label="Remove translation"
                      />
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
                    {t("admin:species_fields.language")} <Box as="span" color="red.500">*</Box>
                  </Text>
                  <Box mb={6}>
                    <ReactSelect
                      name={`translations.${index}.languageId`}
                      placeholder={t("admin:species_fields.language")}
                      options={languages.map(lang => ({ value: lang.id, label: lang.name }))}
                      isLoading={isLoadingLanguages}
                      value={
                        languages.find(lang => lang.id === hForm.watch(`translations.${index}.languageId`))
                          ? { 
                              value: hForm.watch(`translations.${index}.languageId`), 
                              label: languages.find(lang => lang.id === hForm.watch(`translations.${index}.languageId`))?.name 
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
                  />
                  
                  <TextBoxField 
                    name={`translations.${index}.description`}
                    label={t("admin:species_fields.description")}
                    isRequired={true}
                  />
                  
                  <TextBoxField 
                    name={`translations.${index}.urlIdentifier`}
                    label={t("admin:species_fields.url_identifier")}
                    isRequired={true}
                  />
                </Box>
              ))}
            </ModalBody>
            
            <ModalFooter>
              <SubmitButton leftIcon={<CheckIcon />} mr={3}>
                {t("common:save")}
              </SubmitButton>
              <Button variant="ghost" onClick={onClose}>
                {t("common:cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
};

export default TranslateFieldModal; 