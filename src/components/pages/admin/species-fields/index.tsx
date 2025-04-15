import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
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
  Textarea,
  Tooltip,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import AddIcon from "@icons/add";
import TranslateIcon from "@icons/translate";
import {
  axCreateSpeciesField,
  axGetAllFieldsMeta,
  axGetFieldTranslations
} from "@services/species.service";
import { axGetLangList } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { memo, useCallback, useEffect, useState } from "react";

import AddFieldModal from "./add-field-modal";
import TranslateFieldModal from "./translate-field-modal";

// import AddConceptModal from "../add-concept-modal";
// import AddFieldModal from "./add-field-modal";

interface SpeciesField {
  id: number;
  name: string;
  type: string;
  children: SpeciesField[];
}

interface FieldTranslation {
  languageId: string;
  header: string;
  description: string;
  urlIdentifier: string;
}

export default function SpeciesFieldsAdmin({ fieldLanguages }) {
  const { t } = useTranslation();
  const [selectedField, setSelectedField] = useState<SpeciesField | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<SpeciesField | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SpeciesField | null>(null);
  const [speciesFields, setSpeciesFields] = useState<SpeciesField[]>([]);
  const [fieldTranslations, setFieldTranslations] = useState<FieldTranslation[]>([]);

  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [activeLanguages, setActiveLanguages] = useState<string[]>(["en"]);

  const [loading, setLoading] = useState({});
  const [languageData, setLanguageData] = useState({});

  const [translations, setTranslations] = useState({});
  const [editableTranslations, setEditableTranslations] = useState<any>({});

  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

  const [modalLanguage, setModalLanguage] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log("fieldLanguages", fieldLanguages);

  const [tabLanguage, setTabLanguage] = useState({});

  const {
    isOpen: isFieldModalOpen,
    onOpen: onFieldModalOpen,
    onClose: onFieldModalClose
  } = useDisclosure();

  const {
    isOpen: isConceptModalOpen,
    onOpen: onConceptModalOpen,
    onClose: onConceptModalClose
  } = useDisclosure();

  const {
    isOpen: isTranslateModalOpen,
    onOpen: onTranslateModalOpen,
    onClose: onTranslateModalClose
  } = useDisclosure();

  const [availableLanguages, setAvailableLanguages] = useState(fieldLanguages || []);

  // Calculate the English tab index once
  const defaultTabIndex = React.useMemo(() => {
    if (fieldLanguages && fieldLanguages.length > 0) {
      const englishIndex = fieldLanguages.findIndex((lang) => lang.name === "English");
      return englishIndex !== -1 ? englishIndex : 0;
    }
    return 0;
  }, [fieldLanguages]);

  // Add useEffect to fetch data when component mounts
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const { data } = await axGetAllFieldsMeta({ langId: tabLanguage ? tabLanguage.id : 205 });
        // Transform the data to match our expected format
        const transformedData = data.map((item) => ({
          id: item.parentField.id,
          name: item.parentField.header,
          type: item.parentField.label.toLowerCase(),
          children: (item.childField || []).map((child) => ({
            id: child.parentField.id,
            name: child.parentField.header,
            type: child.parentField.label.toLowerCase(),
            children: (child.childFields || []).map((subChild) => ({
              id: subChild.id,
              name: subChild.header,
              type: subChild.label.toLowerCase(),
              children: []
            }))
          }))
        }));
        setSpeciesFields(transformedData);
      } catch (error) {
        console.error("Error fetching fields:", error);
        // You might want to add error handling/display here
      }
    };

    fetchFields();
  }, [tabLanguage]);

  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoadingLanguages(true);
      try {
        const { success, data } = await axGetLangList();
        if (success) {
          const formattedLanguages = data.map((lang) => ({
            label: lang.name,
            code: lang.twoLetterCode || lang.threeLetterCode || "en",
            id: lang.id.toString()
          }));
          console.log("Fetched languages:", formattedLanguages);
          setLanguages(formattedLanguages);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleAddConcept = async (newConcept) => {
    try {
      // Extract the first translation (for backward compatibility)
      const firstTranslation = newConcept.translations[0];
      
      const { success, data } = await axCreateSpeciesField(
        {
          header: firstTranslation.header,
          description: firstTranslation.description,
          urlIdentifier: firstTranslation.urlIdentifier,
          // Include translations if API supports it
          translations: newConcept.translations
        },
        0 // parentId for root concept
      );

      if (success && data) {
        setSpeciesFields([
          ...speciesFields,
          {
            id: data.id,
            name: data.header,
            type: "concept",
            children: []
          }
        ]);
        onConceptModalClose();
      } else {
        notification(t("admin:species_fields.add_concept_error"), NotificationType.Error);
      }
    } catch (error) {
      console.error("Error creating concept:", error);
      notification(t("admin:species_fields.add_concept_error"), NotificationType.Error);
    }
  };

  const handleAddField = async (newField) => {
    try {
      let parentId;

      if (selectedCategory && selectedConcept) {
        parentId = selectedCategory.id;
      } else if (selectedConcept) {
        parentId = selectedConcept.id;
      }

      // Create payload with only the required fields
      const payload = {
        parentId,
        displayOrder: 1, // Add this if needed by your API
        translations: newField.translations.map((t) => ({
          header: t.header,
          description: t.description,
          urlIdentifier: t.urlIdentifier,
          languageId: t.languageId
        }))
      };

      const { success, data } = await axCreateSpeciesField(payload, parentId);

      if (success && data && selectedConcept) {
        const updatedFields = [...speciesFields];
        const conceptIndex = updatedFields.findIndex((c) => c.id === selectedConcept.id);

        if (selectedCategory) {
          // Add subcategory
          const categoryIndex = updatedFields[conceptIndex].children.findIndex(
            (cat) => cat.id === selectedCategory.id
          );
          updatedFields[conceptIndex].children[categoryIndex].children.push({
            id: data.id,
            name: data.header,
            type: "subcategory",
            children: []
          });
        } else {
          // Add category
          updatedFields[conceptIndex].children.push({
            id: data.id,
            name: data.header,
            type: "category",
            children: []
          });
        }

        setSpeciesFields(updatedFields);
        onFieldModalClose();
      } else {
        notification(t("admin:species_fields.add_field_error"), NotificationType.Error);
      }
    } catch (error) {
      console.error("Error creating field:", error);
      notification(t("admin:species_fields.add_field_error"), NotificationType.Error);
    }
  };

  const openAddFieldModal = (concept: SpeciesField, category?: SpeciesField) => {
    setSelectedConcept(concept);
    setSelectedCategory(category || null);
    onFieldModalOpen();
  };

  const openTranslateModal = async (field: SpeciesField) => {
    setSelectedField(field);

    try {
      // Fetch existing translations for the field
      const { data } = await axGetFieldTranslations(field.id);
      setFieldTranslations(data || []);
    } catch (error) {
      console.error("Error fetching field translations:", error);
      notification(t("admin:species_fields.translation_fetch_error"), NotificationType.Error);
      setFieldTranslations([]);
    }

    onTranslateModalOpen();
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

    const handleFieldUpdate = useCallback(
      (fieldId: string, values: any) => {
        console.log("handleFieldUpdate called with:", { fieldId, values, selectedLanguage });

        setTranslations((prev) => ({
          ...prev,
          [fieldId]: {
            ...prev[fieldId],
            [selectedLanguage]: values
          }
        }));

        setEditableTranslations((prev) => ({
          ...prev,
          [fieldId]: {
            ...prev[fieldId],
            [selectedLanguage]: values
          }
        }));
      },
      [selectedLanguage]
    );

    const renderTranslationInputs = (field: any, langCode: string) => {
      return (
        <TranslationInputs field={field} langCode={langCode} onFieldUpdate={handleFieldUpdate} />
      );
    };

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

  const handleAddTranslation = () => {
    setModalLanguage("");
    onOpen();
  };

  const handleModalLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModalLanguage(e.target.value);
  };

  const fetchSpeciesFields = async (langCode) => {
    console.log(`Fetching data for language: ${langCode}`);
    setLoading((prev) => ({ ...prev, [langCode]: true }));

    try {
      const langId = languages.find((lang) => lang.code === langCode)?.id || "205";
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

  // Initialize tabLanguage with the default language
  useEffect(() => {
    if (fieldLanguages && fieldLanguages.length > 0) {
      setTabLanguage(fieldLanguages[defaultTabIndex]);
    }
  }, [fieldLanguages, defaultTabIndex]);

  console.log("selectedLanguage", selectedLanguage);
  console.log("activeLanguages", activeLanguages);
  console.log("tabLanguage", tabLanguage);

  // Add this function to handle successful translation
  const handleTranslationSuccess = (newTranslation) => {
    console.log("Translation success:", newTranslation);
    
    // First, let's directly update our current view data
    if (selectedField && tabLanguage) {
      // Create a deep copy of speciesFields to modify
      const updatedFields = JSON.parse(JSON.stringify(speciesFields));
      
      // Helper function to update a field in the hierarchy
      const updateFieldInHierarchy = (fields, fieldId, newData) => {
        // Check top level (concepts)
        for (let i = 0; i < fields.length; i++) {
          if (fields[i].id === fieldId) {
            fields[i].name = newData.header || fields[i].name;
            return true;
          }
          
          // Check categories
          if (fields[i].children) {
            for (let j = 0; j < fields[i].children.length; j++) {
              if (fields[i].children[j].id === fieldId) {
                fields[i].children[j].name = newData.header || fields[i].children[j].name;
                return true;
              }
              
              // Check subcategories
              if (fields[i].children[j].children) {
                for (let k = 0; k < fields[i].children[j].children.length; k++) {
                  if (fields[i].children[j].children[k].id === fieldId) {
                    fields[i].children[j].children[k].name = newData.header || fields[i].children[j].children[k].name;
                    return true;
                  }
                }
              }
            }
          }
        }
        return false;
      };
      
      // Find and update the field with new translation data
      if (updateFieldInHierarchy(updatedFields, selectedField.id, newTranslation)) {
        console.log("Updated fields:", updatedFields);
        setSpeciesFields(updatedFields);
      }
    }
    
    // Check if this language already exists in our tabs
    const languageExists = availableLanguages.some(
      lang => lang.id === newTranslation.languageId
    );
    
    if (!languageExists) {
      // Find the language details from our languages list
      const language = languages.find(lang => lang.id === newTranslation.languageId);
      
      if (language) {
        // Add the new language to our available languages
        const newLanguage = {
          id: language.id,
          name: language.label,
          code: language.code
        };
        
        setAvailableLanguages(prev => [...prev, newLanguage]);
      }
    }
    
    // Force reload the data from API as a backup
    if (tabLanguage) {
      console.log("Reloading data for language:", tabLanguage);
      axGetAllFieldsMeta({ langId: tabLanguage.id })
        .then(response => {
          if (response.data) {
            // Transform the data to match our expected format
            const transformedData = response.data.map((item) => ({
              id: item.parentField.id,
              name: item.parentField.header,
              type: item.parentField.label.toLowerCase(),
              children: (item.childField || []).map((child) => ({
                id: child.parentField.id,
                name: child.parentField.header,
                type: child.parentField.label.toLowerCase(),
                children: (child.childFields || []).map((subChild) => ({
                  id: subChild.id,
                  name: subChild.header,
                  type: subChild.label.toLowerCase(),
                  children: []
                }))
              }))
            }));
            console.log("Refreshed data from API:", transformedData);
            setSpeciesFields(transformedData);
          }
        })
        .catch(error => {
          console.error("Error refreshing fields after translation:", error);
        });
    }
    
    // Close the modal
    onTranslateModalClose();
  };

  return (
    <Box className="container mt">
      <PageHeading>🧬 {t("admin:species_fields.title")}</PageHeading>

      <Flex justifyContent="flex-end" mb={4}>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onConceptModalOpen}>
          {t("admin:species_fields.add_concept")}
        </Button>
      </Flex>
      <Tabs
        variant="unstyled"
        mb={6}
        rounded="md"
        overflowX="auto"
        onChange={(v) => setTabLanguage(fieldLanguages[v])}
        defaultIndex={defaultTabIndex}
      >
        <TabList bg="gray.100" rounded="md">
          {fieldLanguages.map((fieldlLanguage) => (
            <Tab
              key={fieldlLanguage.id}
              _selected={{ bg: "white", borderRadius: "4", boxShadow: "lg" }}
              m={1}
            >
              {/* {languages.find((lang) => lang.code === langCode)?.label || langCode} */}
              {fieldlLanguage.name}
            </Tab>
          ))}
        </TabList>

        {/* <TabPanels>
          {activeLanguages.map((langCode) => (
            <TabPanel key={langCode} pt={4}>
              {renderLanguageContent(langCode)}
            </TabPanel>
          ))}
        </TabPanels> */}
      </Tabs>

      <Accordion allowMultiple className="white-box">
        {speciesFields.map((concept) => (
          <AccordionItem key={concept.id}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  {concept.name}
                </Box>
                <Flex mr={2}>
                  <Tooltip label={t("admin:species_fields.translate")} hasArrow placement="top">
                    <IconButton
                      aria-label="Translate concept"
                      icon={<TranslateIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTranslateModal(concept);
                      }}
                    />
                  </Tooltip>
                  <Tooltip label={t("admin:species_fields.add_category")} hasArrow placement="top">
                    <IconButton
                      aria-label="Add category"
                      icon={<AddIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddFieldModal(concept);
                      }}
                    />
                  </Tooltip>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Accordion allowMultiple>
                {(concept.children || []).map((category) => (
                  <AccordionItem key={category.id}>
                    <h3>
                      <AccordionButton>
                        <Box flex="1" textAlign="left" pl={4}>
                          {category.name}
                        </Box>
                        <Flex mr={2}>
                          <Tooltip
                            label={t("admin:species_fields.translate")}
                            hasArrow
                            placement="top"
                          >
                            <IconButton
                              aria-label="Translate category"
                              icon={<TranslateIcon />}
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                openTranslateModal(category);
                              }}
                            />
                          </Tooltip>
                          <Tooltip
                            label={t("admin:species_fields.add_subcategory")}
                            hasArrow
                            placement="top"
                          >
                            <IconButton
                              aria-label="Add subcategory"
                              icon={<AddIcon />}
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAddFieldModal(concept, category);
                              }}
                            />
                          </Tooltip>
                        </Flex>
                        <AccordionIcon />
                      </AccordionButton>
                    </h3>
                    <AccordionPanel pb={4}>
                      {category.children && category.children.length > 0 ? (
                        <Box pl={8}>
                          {category.children.map((subcategory) => (
                            <Flex
                              key={subcategory.id}
                              justifyContent="space-between"
                              p={2}
                              borderBottom="1px solid"
                              borderColor="gray.200"
                            >
                              <Box>{subcategory.name}</Box>
                              <Flex>
                                <Tooltip
                                  label={t("admin:species_fields.translate")}
                                  hasArrow
                                  placement="top"
                                >
                                  <IconButton
                                    aria-label="Translate subcategory"
                                    icon={<TranslateIcon />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openTranslateModal(subcategory)}
                                  />
                                </Tooltip>
                              </Flex>
                            </Flex>
                          ))}
                        </Box>
                      ) : (
                        <Box pl={8} py={2} color="gray.500">
                          {t("admin:species_fields.no_subcategories")}
                        </Box>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
                {concept.children.length === 0 && (
                  <Box py={2} color="gray.500">
                    {t("admin:species_fields.no_categories")}
                  </Box>
                )}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Modal for adding a new field (category or subcategory) */}
      <AddFieldModal
        isOpen={isFieldModalOpen}
        onClose={onFieldModalClose}
        onSubmit={handleAddField}
        parentType={selectedCategory ? "category" : "concept"}
        parentName={selectedCategory?.name || selectedConcept?.name}
      />

      {/* Modal for adding a new concept */}
      <AddFieldModal
        isOpen={isConceptModalOpen}
        onClose={onConceptModalClose}
        onSubmit={handleAddConcept}
        parentType="root" // This indicates we're adding a root concept
      />

      {/* Modal for translating a field */}
      <TranslateFieldModal
        isOpen={isTranslateModalOpen}
        onClose={onTranslateModalClose}
        field={selectedField}
        translations={fieldTranslations}
        onSuccess={handleTranslationSuccess}
      />

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
                  .filter((lang) => !activeLanguages.includes(lang.code))
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
            <Button colorScheme="blue" onClick={handleSelectLanguage} isDisabled={!modalLanguage}>
              {t("common:select")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
