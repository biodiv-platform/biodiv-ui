import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  useDisclosure
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import { axCreateSpeciesField,axGetAllFieldsMeta } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import AddConceptModal from "./add-concept-modal";
import AddFieldModal from "./add-field-modal";

// import AddConceptModal from "../add-concept-modal";
// import AddFieldModal from "./add-field-modal";

interface SpeciesField {
  id: number;
  name: string;
  type: string;
  children: SpeciesField[];
}

export default function SpeciesFieldsAdmin() {
  const { t } = useTranslation();
  const [selectedField, setSelectedField] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState<SpeciesField | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SpeciesField | null>(null);
  const [speciesFields, setSpeciesFields] = useState<SpeciesField[]>([]);

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

  // Add useEffect to fetch data when component mounts
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const { data } = await axGetAllFieldsMeta({ langId: "205" });
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
  }, []);

  const handleAddConcept = async (newConcept) => {
    try {
      const payload = {
        parentId: 0, // root level concept has no parent
        label: "concept",
        header: newConcept.name,
        displayOrder: speciesFields.length + 1
      };

      const { success, data } = await axCreateSpeciesField(payload);

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
      let payload;

      if (selectedCategory && selectedConcept) {
        // Add subcategory to a category
        payload = {
          parentId: selectedCategory.id,
          label: "subcategory",
          header: newField.name,
          displayOrder: selectedCategory.children?.length + 1 || 1
        };
      } else if (selectedConcept) {
        // Add category to a concept
        payload = {
          parentId: selectedConcept.id,
          label: "category",
          header: newField.name,
          displayOrder: selectedConcept.children?.length + 1 || 1
        };
      }

      const { success, data } = await axCreateSpeciesField(payload);

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

  return (
    <Box className="container mt">
      <PageHeading>🧬 {t("admin:species_fields.title")}</PageHeading>

      <Flex justifyContent="flex-end" mb={4}>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onConceptModalOpen}>
          {t("admin:species_fields.add_concept")}
        </Button>
      </Flex>

      <Accordion allowMultiple className="white-box">
        {speciesFields.map((concept) => (
          <AccordionItem key={concept.id}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  {concept.name}
                </Box>
                <Flex mr={2}>
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
                  {/* <IconButton
                    aria-label="Edit concept"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    ml={1}
                  />
                  <IconButton
                    aria-label="Delete concept"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    ml={1}
                    colorScheme="red"
                  /> */}
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
                          {/* <IconButton
                            aria-label="Edit category"
                            icon={<EditIcon />}
                            size="sm"
                            variant="ghost"
                            ml={1}
                          />
                          <IconButton
                            aria-label="Delete category"
                            icon={<DeleteIcon />}
                            size="sm"
                            variant="ghost"
                            ml={1}
                            colorScheme="red"
                          /> */}
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
                                {/* <IconButton
                                  aria-label="Edit subcategory"
                                  icon={<EditIcon />}
                                  size="sm"
                                  variant="ghost"
                                />
                                <IconButton
                                  aria-label="Delete subcategory"
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  variant="ghost"
                                  ml={1}
                                  colorScheme="red"
                                /> */}
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
      <AddConceptModal
        isOpen={isConceptModalOpen}
        onClose={onConceptModalClose}
        onSubmit={handleAddConcept}
      />
    </Box>
  );
}
