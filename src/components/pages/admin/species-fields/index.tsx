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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tab,
  TabList,
  Tabs,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
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
import React, { useEffect, useState } from "react";

import AddFieldModal from "./add-field-modal";
import TranslateFieldModal from "./translate-field-modal";

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

interface TabLanguage {
  id: number;
  name: string;
  code: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
  label: string;
}

export default function SpeciesFieldsAdmin({ fieldLanguages }) {
  const { t } = useTranslation();
  const [selectedField, setSelectedField] = useState<SpeciesField | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<SpeciesField | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SpeciesField | null>(null);
  const [speciesFields, setSpeciesFields] = useState<SpeciesField[]>([]);
  const [fieldTranslations, setFieldTranslations] = useState<FieldTranslation[]>([]);

  const [languages, setLanguages] = useState<Language[]>([]);

  const [activeLanguages, setActiveLanguages] = useState<string[]>(["en"]);

  const [languageData, setLanguageData] = useState({});

  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);

  const [modalLanguage, setModalLanguage] = useState<string>("");
  const { isOpen, onClose } = useDisclosure();

  const [tabLanguage, setTabLanguage] = useState<TabLanguage | null>(null);

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

  const {languageId} = useGlobalState();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const [allIndices, setAllIndices] = useState<number[]>([]);
  useEffect(() => {
    if (fieldLanguages?.length > 0) {
      // Convert both to strings to ensure reliable comparison
      const matchingLangIndex = fieldLanguages.findIndex(
        lang => String(lang.id) === String(languageId)
      );
      
      if (matchingLangIndex !== -1) {
        setSelectedTabIndex(matchingLangIndex);
        setTabLanguage(fieldLanguages[matchingLangIndex]);
      } else {
        // Default to English or first tab
        const englishIndex = fieldLanguages.findIndex(lang => lang.name === "English");
        const defaultIndex = englishIndex !== -1 ? englishIndex : 0;
        setSelectedTabIndex(defaultIndex);
        setTabLanguage(fieldLanguages[defaultIndex]);
      }
    }
  }, [fieldLanguages, languageId]);
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const { data } = await axGetAllFieldsMeta({ langId: tabLanguage ? tabLanguage.id : SITE_CONFIG.LANGUAGE.DEFAULT_ID });
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

  useEffect(() => {
    // Get all possible indices based on the data
    const indices = Array.from({ length: speciesFields.length }, (_, i) => i);
    setAllIndices(indices);
  }, [speciesFields.length]);

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
      setFieldTranslations([]);
    }

    onTranslateModalOpen();
  };

  const handleSelectLanguage = () => {
    if (modalLanguage && modalLanguage.trim() !== "") {
      if (!activeLanguages.includes(modalLanguage)) {
        const newActiveLanguages = [...activeLanguages, modalLanguage];
        setActiveLanguages(newActiveLanguages);

        // Fetch the data for this language if we haven't already
        if (!languageData[modalLanguage]) {
          fetchSpeciesFields(modalLanguage);
        }
      }

      onClose();
    }
  };

  const handleModalLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModalLanguage(e.target.value);
  };

  const fetchSpeciesFields = async (langCode) => {
    try {
      const langId = languages.find((lang) => lang.code === langCode)?.id || SITE_CONFIG.LANGUAGE.DEFAULT_ID;
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
    }
  };

  // Add this function to handle successful translation
  const handleTranslationSuccess = (newTranslation) => {
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
                    fields[i].children[j].children[k].name =
                      newData.header || fields[i].children[j].children[k].name;
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
        setSpeciesFields(updatedFields);
      }
    }

    // Check if this language already exists in our tabs
    const languageExists = availableLanguages.some((lang) => lang.id === newTranslation.languageId);

    if (!languageExists) {
      // Find the language details from our languages list
      const language = languages.find((lang) => lang.id === newTranslation.languageId);

      if (language) {
        // Add the new language to our available languages
        const newLanguage = {
          id: language.id,
          name: language.label,
          code: language.code
        };

        setAvailableLanguages((prev) => [...prev, newLanguage]);
      }
    }

    // Force reload the data from API as a backup
    if (tabLanguage) {
      axGetAllFieldsMeta({ langId: tabLanguage.id })
        .then((response) => {
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
            setSpeciesFields(transformedData);
          }
        })
        .catch((error) => {
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
        index={selectedTabIndex}
        onChange={(index) => {
          setSelectedTabIndex(index);
          setTabLanguage(fieldLanguages[index]);
        }}
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

      <Accordion 
        allowMultiple 
        className="white-box" 
        index={allIndices}
        onChange={(expandedIndices) => {
          // Ensure we're setting an array of numbers
          setAllIndices(Array.isArray(expandedIndices) ? expandedIndices : []);
        }}
      >
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
              <Accordion 
                allowMultiple 
                index={Array.from({ length: concept.children?.length || 0 }, (_, i) => i)}
              >
                {concept.children?.map((category) => (
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
              Select
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
