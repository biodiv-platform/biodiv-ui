import {
  Accordion,
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  IconButton,
  Link,
  Tabs,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import AddIcon from "@icons/add";
import {
  axCreateSpeciesField,
  axGetAllFieldsMeta,
  axGetFieldTranslations
} from "@services/species.service";
import { axGetLangList } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { LuLanguages } from "react-icons/lu";

import Tooltip from "@/components/@core/tooltip";
import { Field } from "@/components/ui/field";
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";

import AddFieldModal from "./add-field-modal";
import TranslateFieldModal from "./translate-field-modal";

interface SpeciesField {
  id: number;
  name: string;
  type: string;
  children: SpeciesField[];
  description: string;
  urlIdentifier: string;
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
  const { open, onClose } = useDisclosure();

  const [tabLanguage, setTabLanguage] = useState<TabLanguage | null>(null);

  const {
    open: isFieldModalOpen,
    onOpen: onFieldModalOpen,
    onClose: onFieldModalClose
  } = useDisclosure();

  const {
    open: isConceptModalOpen,
    onOpen: onConceptModalOpen,
    onClose: onConceptModalClose
  } = useDisclosure();

  const {
    open: isTranslateModalOpen,
    onOpen: onTranslateModalOpen,
    onClose: onTranslateModalClose
  } = useDisclosure();

  const [availableLanguages, setAvailableLanguages] = useState(fieldLanguages || []);

  const { languageId } = useGlobalState();
  const [selectedTab, setSelectedTab] = useState<string>("");

  // Reset tab when field languages change or language ID changes
  useEffect(() => {
    if (fieldLanguages?.length > 0) {
      // Convert both to strings to ensure reliable comparison
      const matchingLang = fieldLanguages.find((lang) => String(lang.id) === String(languageId));

      if (matchingLang) {
        setSelectedTab(matchingLang.id.toString());
        setTabLanguage(matchingLang);
      } else {
        // Default to English or first tab
        const englishLang = fieldLanguages.find((lang) => lang.name === "English");
        const defaultLang = englishLang || fieldLanguages[0];
        setSelectedTab(defaultLang.id.toString());
        setTabLanguage(defaultLang);
      }
    }
  }, [fieldLanguages, languageId]);

  // Add useEffect to fetch data when component mounts
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const { data } = await axGetAllFieldsMeta({
          langId: tabLanguage ? tabLanguage.id : SITE_CONFIG.LANGUAGE.DEFAULT_ID
        });
        // Transform the data to match our expected format
        const transformedData = data.map((item) => ({
          id: item.parentField.id,
          name: item.parentField.header,
          type: item.parentField.label.toLowerCase(),
          description: item.parentField.description || "",
          urlIdentifier: item.parentField.urlIdentifier || "",
          children: (item.childField || []).map((child) => ({
            id: child.parentField.id,
            name: child.parentField.header,
            type: child.parentField.label.toLowerCase(),
            description: child.parentField.description || "",
            urlIdentifier: child.parentField.urlIdentifier || "",
            children: (child.childFields || []).map((subChild) => ({
              id: subChild.id,
              name: subChild.header,
              type: subChild.label.toLowerCase(),
              description: subChild.description || "",
              urlIdentifier: subChild.urlIdentifier || "",
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

    if (tabLanguage) {
      fetchFields();
    }
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
            children: [],
            description: data.description,
            urlIdentifier: data.urlIdentifier
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
            children: [],
            description: data.description || "",
            urlIdentifier: data.urlIdentifier || ""
          });
        } else {
          // Add category
          updatedFields[conceptIndex].children.push({
            id: data.id,
            name: data.header,
            type: "category",
            children: [],
            description: data.description || "",
            urlIdentifier: data.urlIdentifier || ""
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

  const handleModalLanguageChange = (e) => {
    setModalLanguage(e.target.value);
  };

  const fetchSpeciesFields = async (langCode) => {
    try {
      const langId =
        languages.find((lang) => lang.code === langCode)?.id || SITE_CONFIG.LANGUAGE.DEFAULT_ID;
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
              description: item.parentField.description || "",
              urlIdentifier: item.parentField.urlIdentifier || "",
              children: (item.childField || []).map((child) => ({
                id: child.parentField.id,
                name: child.parentField.header,
                type: child.parentField.label.toLowerCase(),
                description: child.parentField.description || "",
                urlIdentifier: child.parentField.urlIdentifier || "",
                children: (child.childFields || []).map((subChild) => ({
                  id: subChild.id,
                  name: subChild.header,
                  type: subChild.label.toLowerCase(),
                  description: subChild.description || "",
                  urlIdentifier: subChild.urlIdentifier || "",
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

  const handleTabChange = (details: { value: string }) => {
    setSelectedTab(details.value);
    const selectedLang = fieldLanguages.find((lang) => lang.id.toString() === details.value);
    if (selectedLang) {
      setTabLanguage(selectedLang);
    }
  };

  return (
    <Box className="container mt">
      <PageHeading>🧬 {t("admin:species_fields.title")}</PageHeading>

      <Flex justifyContent="flex-end" mb={4}>
        <Button colorPalette="blue" onClick={onConceptModalOpen}>
          <AddIcon />
          {t("admin:species_fields.add_concept")}
        </Button>
      </Flex>

      <Tabs.Root value={selectedTab} onValueChange={handleTabChange} mb={6} variant={"plain"}>
        <Tabs.List bg="gray.100" rounded="md" p={1}>
          {fieldLanguages.map((fieldLanguage) => (
            <Tabs.Trigger
              key={fieldLanguage.id}
              value={fieldLanguage.id.toString()}
              px={4}
              py={2}
              _selected={{
                bg: "white",
                borderRadius: "md",
                boxShadow: "sm",
                fontWeight: "medium"
              }}
            >
              {fieldLanguage.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {fieldLanguages.map((fieldLanguage) => (
          <Tabs.Content key={fieldLanguage.id} value={fieldLanguage.id.toString()}>
            <Accordion.Root multiple className="white-box" p={4}>
              {speciesFields.map((concept) => (
                <Accordion.Item key={concept.id} value={concept.id.toString()}>
                  <h2>
                    <Accordion.ItemTrigger>
                      <VStack gap={1} alignItems="flex-start" width="full">
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          {concept.name}
                        </Box>
                        {concept.description && (
                          <Box fontSize="sm" color="gray.600" textAlign="left">
                            <span style={{ fontWeight: "medium" }}>Description:</span>{" "}
                            {concept.description}
                          </Box>
                        )}
                        {concept.urlIdentifier && (
                          <Box fontSize="sm" color="gray.500" textAlign="left">
                            <span style={{ fontWeight: "medium" }}>URL:</span>{" "}
                            <Link
                              href={concept.urlIdentifier}
                              color="blue.500"
                              textDecoration="underline"
                            >
                              {concept.urlIdentifier}
                            </Link>
                          </Box>
                        )}
                      </VStack>

                      <Flex mr={2}>
                        <Tooltip
                          content={t("admin:species_fields.translate")}
                          showArrow
                          positioning={{ placement: "top" }}
                        >
                          <IconButton
                            aria-label="Translate concept"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTranslateModal(concept);
                            }}
                          >
                            <LuLanguages />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          content={t("admin:species_fields.add_category")}
                          showArrow
                          positioning={{ placement: "top" }}
                        >
                          <IconButton
                            aria-label="Add category"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAddFieldModal(concept);
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                      </Flex>
                      <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                  </h2>
                  <Accordion.ItemContent pb={4}>
                    <Accordion.Root multiple>
                      {(concept.children || []).map((category) => (
                        <Accordion.Item key={category.id} value={category.id.toString()}>
                          <h3>
                            <Accordion.ItemTrigger>
                              <VStack gap={1} alignItems="flex-start" width="full">
                                <Box flex="1" textAlign="left" pl={4}>
                                  {category.name}
                                </Box>
                                {category.description && (
                                  <Box fontSize="sm" color="gray.600" textAlign="left" pl={4}>
                                    <span style={{ fontWeight: "medium" }}>Description:</span>{" "}
                                    {category.description}
                                  </Box>
                                )}
                                {category.urlIdentifier && (
                                  <Box fontSize="sm" color="gray.500" textAlign="left" pl={4}>
                                    <span style={{ fontWeight: "medium" }}>URL:</span>{" "}
                                    <Link
                                      href={category.urlIdentifier}
                                      color="blue.500"
                                      textDecoration="underline"
                                    >
                                      {category.urlIdentifier}
                                    </Link>
                                  </Box>
                                )}
                              </VStack>
                              <Flex mr={2}>
                                <Tooltip
                                  content={t("admin:species_fields.translate")}
                                  showArrow
                                  positioning={{ placement: "top" }}
                                >
                                  <IconButton
                                    aria-label="Translate category"
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openTranslateModal(category);
                                    }}
                                  >
                                    <LuLanguages />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  content={t("admin:species_fields.add_subcategory")}
                                  showArrow
                                  positioning={{ placement: "top" }}
                                >
                                  <IconButton
                                    aria-label="Add subcategory"
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openAddFieldModal(concept, category);
                                    }}
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </Tooltip>
                              </Flex>
                              <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                          </h3>
                          <Accordion.ItemContent pb={4}>
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
                                    <VStack gap={1} alignItems="flex-start" width="full">
                                      <Box>{subcategory.name}</Box>
                                      {subcategory.description && (
                                        <Box fontSize="sm" color="gray.600" textAlign="left">
                                          <span style={{ fontWeight: "medium" }}>Description:</span>{" "}
                                          {subcategory.description}
                                        </Box>
                                      )}
                                      {subcategory.urlIdentifier && (
                                        <Box fontSize="sm" color="gray.500" textAlign="left">
                                          <span style={{ fontWeight: "medium" }}>URL:</span>{" "}
                                          <Link
                                            href={subcategory.urlIdentifier}
                                            color="blue.500"
                                            textDecoration="underline"
                                          >
                                            {subcategory.urlIdentifier}
                                          </Link>
                                        </Box>
                                      )}
                                    </VStack>
                                    <Flex>
                                      <Tooltip
                                        content={t("admin:species_fields.translate")}
                                        showArrow
                                        positioning={{ placement: "top" }}
                                      >
                                        <IconButton
                                          aria-label="Translate subcategory"
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => openTranslateModal(subcategory)}
                                        >
                                          <LuLanguages />
                                        </IconButton>
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
                          </Accordion.ItemContent>
                        </Accordion.Item>
                      ))}
                      {concept.children.length === 0 && (
                        <Box py={2} color="gray.500">
                          {t("admin:species_fields.no_categories")}
                        </Box>
                      )}
                    </Accordion.Root>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Tabs.Content>
        ))}
      </Tabs.Root>

      {/* Modal for adding a new field (category or subcategory) */}
      {isFieldModalOpen && (
        <AddFieldModal
          isOpen={isFieldModalOpen}
          onClose={onFieldModalClose}
          onSubmit={handleAddField}
          parentType={selectedCategory ? "category" : "concept"}
          parentName={selectedCategory?.name || selectedConcept?.name}
        />
      )}

      {/* Modal for adding a new concept */}
      {isConceptModalOpen && (
        <AddFieldModal
          isOpen={isConceptModalOpen}
          onClose={onConceptModalClose}
          onSubmit={handleAddConcept}
          parentType="root" // This indicates we're adding a root concept
        />
      )}

      {/* Modal for translating a field */}
      {isTranslateModalOpen && (
        <TranslateFieldModal
          isOpen={isTranslateModalOpen}
          onClose={onTranslateModalClose}
          field={selectedField}
          translations={fieldTranslations}
          onSuccess={handleTranslationSuccess}
        />
      )}

      {/* Language Selection Modal */}
      <Dialog.Root open={open} onOpenChange={onClose}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>{t("admin:species_fields.add_translation")}</Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <Field required color="red.500" label={t("admin:species_fields.language")}>
                <NativeSelectRoot
                  defaultValue={modalLanguage}
                  onChange={handleModalLanguageChange}
                  disabled={isLoadingLanguages}
                >
                  <NativeSelectField>
                    <option value="">Select Language</option>
                    {languages
                      .filter((lang) => !activeLanguages.includes(lang.code))
                      .map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="ghost" mr={3} onClick={onClose}>
                {t("common:cancel")}
              </Button>
              <Button colorPalette="blue" onClick={handleSelectLanguage} disabled={!modalLanguage}>
                Select
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
