import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import SITE_CONFIG from "@configs/site-config";
import CheckIcon from "@icons/check";
import { axGetAllFieldsMeta, axUpdateSpeciesFieldTranslations } from "@services/species.service";
import { axGetLangList } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import { debounce } from "lodash";
import useTranslation from "next-translate/useTranslation";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface Language {
  id: string;
  name: string;
  code: string;
  label: string;
}

const TranslationField = memo(
  ({
    label,
    value,
    onChange,
    isTextArea
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    isTextArea?: boolean;
  }) => {
    const InputComponent = isTextArea ? Textarea : Input;

    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <InputComponent value={value} onChange={(e) => onChange(e.target.value)} />
      </FormControl>
    );
  }
);

const TranslationInputs = memo(
  ({
    field,
    langCode,
    onFieldUpdate
  }: {
    field: any;
    langCode: string;
    onFieldUpdate?: (fieldId: string, values: any) => void;
  }) => {
    const [values, setValues] = useState({
      header: field.name || field.header || "",
      description: field.description || "",
      urlIdentifier: field.urlIdentifier || ""
    });

    const updateField = useCallback((key: string, value: string) => {
      setValues((prev) => ({
        ...prev,
        [key]: value
      }));
    }, []);

    const getFieldLabel = () => {
      if (field.type === "concept") return "Concept Name *";
      if (field.type === "category") return "Category Name *";
      return "Subcategory Name *";
    };

    useEffect(() => {
      // Only sync with parent state when the user stops typing for 500ms
      const timeoutId = setTimeout(() => {
        onFieldUpdate?.(field.id, values);
      }, 500);

      return () => clearTimeout(timeoutId);
    }, [values, field.id, onFieldUpdate]);

    return (
      <VStack
        align="stretch"
        spacing={4}
        mt={2}
        mb={4}
        p={4}
        bg="white"
        borderRadius="md"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <TranslationField
          label={getFieldLabel()}
          value={values.header}
          onChange={(value) => updateField("header", value)}
        />

        <TranslationField
          label="Description *"
          value={values.description}
          onChange={(value) => updateField("description", value)}
          isTextArea
        />

        <TranslationField
          label="URL Identifier *"
          value={values.urlIdentifier}
          onChange={(value) => updateField("urlIdentifier", value)}
        />
      </VStack>
    );
  }
);

export default function SpeciesFieldTranslations() {
  const { t } = useTranslation();
  const hForm = useForm({
    defaultValues: {
      translations: {}
    }
  });
  const [fields, setFields] = useState([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [activeLanguages, setActiveLanguages] = useState<string[]>(["en"]);
  const [modalLanguage, setModalLanguage] = useState<string>("");
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState({});
  const [languageData, setLanguageData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editableTranslations, setEditableTranslations] = useState<any>({});
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoadingLanguages(true);
      try {
        const { success, data } = await axGetLangList();
        if (success) {
          const formattedLanguages = data.map(lang => ({
            label: lang.name,
            code: lang.twoLetterCode || lang.threeLetterCode || 'en',
            id: lang.id.toString()
          }));
          console.log('Fetched languages:', formattedLanguages); // Debug log
          setLanguages(formattedLanguages);
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    // Fetch English data by default
    fetchSpeciesFields("en");
  }, []);

  useEffect(() => {
    const initialEditableValues: any = {};

    const processField = (field: any, parentPath?: string) => {
      const fieldId = field.id || field.parentField?.id;
      if (!fieldId) return;

      initialEditableValues[fieldId] = {
        [selectedLanguage]: {
          header:
            selectedLanguage === "en"
              ? field.header || field.parentField?.header || ""
              : translations[fieldId]?.[selectedLanguage]?.header || "",
          description:
            selectedLanguage === "en"
              ? field.description || field.parentField?.description || ""
              : translations[fieldId]?.[selectedLanguage]?.description || "",
          urlIdentifier:
            selectedLanguage === "en"
              ? field.urlIdentifier || field.parentField?.urlIdentifier || ""
              : translations[fieldId]?.[selectedLanguage]?.urlIdentifier || ""
        }
      };

      // Process child fields
      if (field.childField) {
        field.childField.forEach((child: any) => processField(child, fieldId));
      }
      if (field.childFields) {
        field.childFields.forEach((child: any) => processField(child, fieldId));
      }
    };

    // Process all top-level fields
    fields.forEach((item) => {
      processField(item);
    });

    setEditableTranslations(initialEditableValues);
  }, [fields, selectedLanguage, translations]);

  const fetchSpeciesFields = async (langCode) => {
    console.log(`Fetching data for language: ${langCode}`);
    setLoading((prev) => ({ ...prev, [langCode]: true }));

    try {
      const langId = languages.find((lang) => lang.code === langCode)?.id || SITE_CONFIG.LANGUAGE.DEFAULT_ID;
      console.log(`Using language ID: ${langId} for ${langCode}`);

      const { data } = await axGetAllFieldsMeta({ langId });

      if (data) {
        if (!data || data.length === 0) return;

        // Transform the data to a more usable format
        const transformedData = data.map((item) => {
          const parentField = item.parentField || item;
          return {
            id: parentField.id,
            name: parentField.header,
            description: parentField.description || "",
            urlIdentifier: parentField.urlIdentifier || "",
            type: parentField.label?.toLowerCase() || "concept",
            children: (item.childField || []).map((child) => {
              const childParentField = child.parentField || child;
              return {
                id: childParentField.id,
                name: childParentField.header,
                description: childParentField.description || "",
                urlIdentifier: childParentField.urlIdentifier || "",
                type: childParentField.label?.toLowerCase() || "category",
                children: (child.childFields || []).map((subChild) => ({
                  id: subChild.id,
                  name: subChild.header,
                  description: subChild.description || "",
                  urlIdentifier: subChild.urlIdentifier || "",
                  type: subChild.label?.toLowerCase() || "subcategory"
                }))
              };
            })
          };
        });

        console.log("Transformed Data:", transformedData);
        setLanguageData((prev) => ({
          ...prev,
          [langCode]: transformedData
        }));
      } else {
        notification(t("admin:species_fields.fetch_error"));
      }
    } catch (error) {
      console.error(`Error fetching species fields for ${langCode}:`, error);
      notification(t("admin:species_fields.fetch_error"));
    } finally {
      setLoading((prev) => ({ ...prev, [langCode]: false }));
    }
  };

  const handleAddTranslation = () => {
    setModalLanguage("");
    onOpen();
  };

  const handleModalLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModalLanguage(e.target.value);
  };

  const handleSelectLanguage = () => {
    if (modalLanguage && modalLanguage.trim() !== "") {
      console.log("Selected language from modal:", modalLanguage);

      if (!activeLanguages.includes(modalLanguage)) {
        console.log("Adding to active languages:", modalLanguage);
        const newActiveLanguages = [...activeLanguages, modalLanguage];
        console.log("New active languages:", newActiveLanguages);
        setActiveLanguages(newActiveLanguages);

        // Fetch the data for this language if we haven't already
        if (!languageData[modalLanguage]) {
          fetchSpeciesFields(modalLanguage);
        }
      }

      onClose();
    }
  };

  const handleFieldUpdate = useCallback(
    (fieldId: string, values: any) => {
      console.log("handleFieldUpdate called with:", { fieldId, values, selectedLanguage });

      const updatedTranslations = {
        [fieldId]: {
          [selectedLanguage]: values
        }
      };

      setTranslations((prev) => ({
        ...prev,
        ...updatedTranslations
      }));

      setEditableTranslations((prev) => ({
        ...prev,
        ...updatedTranslations
      }));
    },
    [selectedLanguage]
  );

  const renderTranslationInputs = (field: any, langCode: string) => {
    return (
      <TranslationInputs field={field} langCode={langCode} onFieldUpdate={handleFieldUpdate} />
    );
  };

  const renderLanguageContent = (langCode) => {
    const isLoading = loading[langCode];
    const langFields = languageData[langCode] || [];

    if (isLoading) {
      return (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      );
    }

    return (
      <Accordion allowMultiple mb={6}>
        {langFields.map((concept) => (
          <AccordionItem key={concept.id} mb={4} border="none">
            <Box bg="gray.50" borderRadius="md" boxShadow="md" overflow="hidden">
              <AccordionButton bg="blue.50" _hover={{ bg: "blue.100" }} py={3}>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  {concept.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel bg="gray.50" p={4}>
                {renderTranslationInputs(concept, langCode)}

                {concept.children?.length > 0 && (
                  <Accordion allowMultiple mt={4}>
                    {concept.children.map((category) => (
                      <AccordionItem key={category.id} mb={3} border="none">
                        <Box bg="white" borderRadius="md" boxShadow="sm" overflow="hidden">
                          <AccordionButton bg="green.50" _hover={{ bg: "green.100" }} py={2}>
                            <Box flex="1" textAlign="left" fontWeight="bold">
                              {category.name}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel bg="white" p={4}>
                            {renderTranslationInputs(category, langCode)}

                            {category.children?.length > 0 && (
                              <Accordion allowMultiple mt={4}>
                                {category.children.map((subcategory) => (
                                  <AccordionItem key={subcategory.id} mb={3} border="none">
                                    <Box
                                      bg="gray.50"
                                      borderRadius="md"
                                      boxShadow="sm"
                                      overflow="hidden"
                                    >
                                      <AccordionButton
                                        bg="purple.50"
                                        _hover={{ bg: "purple.100" }}
                                        py={2}
                                      >
                                        <Box flex="1" textAlign="left" fontWeight="bold">
                                          {subcategory.name}
                                        </Box>
                                        <AccordionIcon />
                                      </AccordionButton>
                                      <AccordionPanel bg="gray.50" p={4}>
                                        {renderTranslationInputs(subcategory, langCode)}
                                      </AccordionPanel>
                                    </Box>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            )}
                          </AccordionPanel>
                        </Box>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </AccordionPanel>
            </Box>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  const handleOnSubmit = (values) => {
    handleSaveTranslations();
  };

  const handleSaveTranslations = async () => {
    try {
      // Combine both states to ensure we have all translations
      const translationsData = { ...translations, ...editableTranslations };

      const formattedTranslations = Object.entries(translationsData).map(([fieldId, langData]) => ({
        fieldId: parseInt(fieldId),
        translations: Object.entries(langData as Record<string, any>).map(
          ([langCode, fieldData]) => ({
            langId: parseInt(languages.find((l) => l.code === langCode)?.id || SITE_CONFIG.LANGUAGE.DEFAULT_ID),
            ...fieldData
          })
        )
      }));

      console.log("Final Formatted Translations:", formattedTranslations);

      if (formattedTranslations.length === 0) {
        notification(t("admin:species_fields.no_translations"), NotificationType.Error);
        return;
      }

      await axUpdateSpeciesFieldTranslations(formattedTranslations);

      notification(t("admin:species_fields.translations_saved"), NotificationType.Success);
    } catch (error) {
      console.error("Error saving translations:", error);
      notification(t("admin:species_fields.save_error"));
    }
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="lg">
          {t("admin:species_fields.translations")}
        </Heading>
        <Button colorScheme="green" onClick={handleAddTranslation}>
          {t("admin:species_fields.add_translation")}
        </Button>
      </Flex>

      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          {/* Chakra Tabs Component */}
          <Tabs
            variant="unstyled"
            mb={6}
            rounded="md"
            overflowX="auto"
            onChange={(index) => setSelectedLanguage(activeLanguages[index])}
          >
            <TabList bg="gray.100" rounded="md">
              {activeLanguages.map((langCode) => (
                <Tab
                  key={langCode}
                  _selected={{ bg: "white", borderRadius: "4", boxShadow: "lg" }}
                  m={1}
                >
                  {languages.find((lang) => lang.code === langCode)?.label || langCode}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {activeLanguages.map((langCode) => (
                <TabPanel key={langCode} pt={4}>
                  {renderLanguageContent(langCode)}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>

          <Box mb={6}>
            <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
          </Box>
        </form>
      </FormProvider>

      {/* Language Selection Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("admin:species_fields.add_translation")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel color="red.500">{t("admin:species_fields.language")} *</FormLabel>
              <Select
                placeholder={isLoadingLanguages ? "Loading languages..." : "Select Language"}
                value={modalLanguage}
                onChange={handleModalLanguageChange}
                isDisabled={isLoadingLanguages}
              >
                {languages
                  .filter(lang => !activeLanguages.includes(lang.code))
                  .map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {t("common:cancel")}
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSelectLanguage}
              isDisabled={!modalLanguage}
            >
              {t("common:select")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
