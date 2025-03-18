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
  Tabs,
  Text,
  Textarea,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import CheckIcon from "@icons/check";
import { axGetAllFieldsMeta, axUpdateSpeciesFieldTranslations } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function SpeciesFieldTranslations() {
  const { t } = useTranslation();
  const hForm = useForm({
    defaultValues: {
      translations: {}
    }
  });
  const [fields, setFields] = useState([]);
  const [languages] = useState([
    { label: "English", code: "en", id: "205" },
    { label: "French", code: "fr", id: "219" }
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [modalLanguage, setModalLanguage] = useState<string>("");
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchSpeciesFields();
  }, []);

  const fetchSpeciesFields = async () => {
    setLoading(true);
    try {
      const { data } = await axGetAllFieldsMeta({ langId: "205" });

      if (data) {
        // Transform the data to match our expected format
        const transformedData = data.map((item) => ({
          id: item.parentField.id,
          name: item.parentField.header,
          description: item.parentField.description || "",
          urlIdentifier: item.parentField.urlIdentifier || "",
          type: item.parentField.label.toLowerCase(),
          children: (item.childField || []).map((child) => ({
            id: child.parentField.id,
            name: child.parentField.header,
            description: child.parentField.description || "",
            urlIdentifier: child.parentField.urlIdentifier || "",
            type: child.parentField.label.toLowerCase(),
            children: (child.childFields || []).map((subChild) => ({
              id: subChild.id,
              name: subChild.header,
              description: subChild.description || "",
              urlIdentifier: subChild.urlIdentifier || "",
              type: subChild.label.toLowerCase(),
              children: []
            }))
          }))
        }));

        setFields(transformedData);
      } else {
        notification(t("admin:species_fields.fetch_error"));
      }
    } catch (error) {
      console.error("Error fetching species fields:", error);
      notification(t("admin:species_fields.fetch_error"));
    } finally {
      setLoading(false);
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
    if (modalLanguage) {
      setSelectedLanguage(modalLanguage);
      onClose();
    }
  };

  const handleInputChange = (field: any, property: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [field.id]: {
        ...prev[field.id],
        [selectedLanguage]: {
          ...(prev[field.id]?.[selectedLanguage] || {}),
          [property]: value
        }
      }
    }));
  };

  const handleSaveTranslations = async () => {
    try {
      // Format translations for API
      const formattedTranslations = Object.entries(translations).map(([fieldId, langData]) => ({
        fieldId,
        translations: Object.entries(langData).map(([langCode, fieldData]) => ({
          langId: languages.find((l) => l.code === langCode)?.id,
          ...fieldData
        }))
      }));

      await axUpdateSpeciesFieldTranslations(formattedTranslations);
      notification(t("admin:species_fields.translations_saved"), NotificationType.Success);
      setTranslations({});
    } catch (error) {
      console.error("Error saving translations:", error);
      notification(t("admin:species_fields.save_error"));
    }
  };

  const handleOnSubmit = (values) => {
    handleSaveTranslations();
  };

  const renderTranslationInputs = (field: any) => {
    const currentTranslation = translations[field.id]?.[selectedLanguage] || {};

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
        <FormControl>
          <FormLabel>
            {field.type === "concept"
              ? "Concept Name"
              : field.type === "category"
              ? "Category Name"
              : "Subcategory Name"}{" "}
            *
          </FormLabel>
          <Input
            placeholder={field.name}
            value={currentTranslation.header || ""}
            onChange={(e) => handleInputChange(field, "header", e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description *</FormLabel>
          <Textarea
            placeholder={field.description}
            value={currentTranslation.description || ""}
            onChange={(e) => handleInputChange(field, "description", e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>URL Identifier *</FormLabel>
          <Input
            placeholder={field.urlIdentifier}
            value={currentTranslation.urlIdentifier || ""}
            onChange={(e) => handleInputChange(field, "urlIdentifier", e.target.value)}
          />
        </FormControl>
      </VStack>
    );
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="lg">
          {t("admin:species_fields.translations")}
        </Heading>
        <Button colorScheme="green" onClick={onOpen}>
          {t("admin:species_fields.add_translation")}
        </Button>
      </Flex>

      {/* Full-width tabs for language selection */}
      <Box
        mx="-24px" // Negative margin to extend beyond container
        mb={6}
      >
        <Tabs
          variant="unstyled"
          bg="gray.100"
          rounded="md"
          index={0} // Always show the first tab as selected
        >
          <TabList>
            <Tab _selected={{ bg: "white", borderRadius: "4px", boxShadow: "lg" }} m={1}>
              {languages.find((lang) => lang.code === selectedLanguage)?.label || "English"}
            </Tab>
          </TabList>
        </Tabs>
      </Box>

      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box>
          <FormProvider {...hForm}>
            <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
              <Accordion allowMultiple mb={6}>
                {fields.map((concept) => (
                  <AccordionItem 
                    key={concept.id}
                    mb={4}
                    border="none"
                  >
                    <Box 
                      bg="gray.50" 
                      borderRadius="md" 
                      boxShadow="md"
                      overflow="hidden"
                    >
                      <AccordionButton 
                        bg="blue.50" 
                        _hover={{ bg: "blue.100" }}
                        py={3}
                      >
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          {concept.name}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel bg="gray.50" p={4}>
                        {renderTranslationInputs(concept)}

                        {concept.children?.length > 0 && (
                          <Accordion allowMultiple mt={4}>
                            {concept.children.map((category) => (
                              <AccordionItem 
                                key={category.id}
                                mb={3}
                                border="none"
                              >
                                <Box 
                                  bg="white" 
                                  borderRadius="md" 
                                  boxShadow="sm"
                                  overflow="hidden"
                                >
                                  <AccordionButton 
                                    bg="green.50" 
                                    _hover={{ bg: "green.100" }}
                                    py={2}
                                  >
                                    <Box flex="1" textAlign="left" fontWeight="bold">
                                      {category.name}
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                  <AccordionPanel bg="white" p={4}>
                                    {renderTranslationInputs(category)}

                                    {category.children?.length > 0 && (
                                      <Accordion allowMultiple mt={4}>
                                        {category.children.map((subcategory) => (
                                          <AccordionItem 
                                            key={subcategory.id}
                                            mb={3}
                                            border="none"
                                          >
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
                                                {renderTranslationInputs(subcategory)}
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
              <Box mb={6}>
                <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
              </Box>
            </form>
          </FormProvider>
        </Box>
      )}

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
                placeholder="Select Language"
                value={modalLanguage}
                onChange={handleModalLanguageChange}
              >
                {languages.map((lang) => (
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
    </Container>
  );
}
