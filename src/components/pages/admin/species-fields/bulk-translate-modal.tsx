import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useState, useEffect } from "react";

interface BulkTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: any[];
  onSubmit: (translations: any) => void;
  selectedLanguage?: string;
}

export default function BulkTranslateModal({
  isOpen,
  onClose,
  fields,
  onSubmit,
  selectedLanguage = "hi"
}: BulkTranslateModalProps) {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState({});

  // Reset translations when modal opens or language changes
  useEffect(() => {
    if (isOpen) {
      setTranslations({});
    }
  }, [isOpen, selectedLanguage]);

  const handleInputChange = (fieldId: number, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        [selectedLanguage]: value
      }
    }));
  };

  const handleSubmit = () => {
    onSubmit(translations);
    onClose();
  };

  const renderTranslationInputs = (field: any) => (
    <VStack align="stretch" spacing={4}>
      <FormControl>
        <FormLabel>English (Original)</FormLabel>
        <Input
          value={field.name}
          isReadOnly
          bg="gray.50"
        />
      </FormControl>
      <FormControl>
        <FormLabel>{t(`languages:${selectedLanguage}`) || selectedLanguage}</FormLabel>
        <Input
          value={translations[field.id]?.[selectedLanguage] || ''}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          placeholder={`Enter ${selectedLanguage} translation`}
        />
      </FormControl>
    </VStack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxH="80vh">
        <ModalHeader>
          {t("admin:species_fields.bulk_translate_title")} - {t(`languages:${selectedLanguage}`) || selectedLanguage}
        </ModalHeader>
        <ModalBody overflowY="auto">
          <Accordion allowMultiple>
            {fields.map((concept) => (
              <AccordionItem key={concept.id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    {concept.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  {renderTranslationInputs(concept)}
                  
                  {concept.children?.map((category) => (
                    <Accordion key={category.id} allowMultiple mt={4}>
                      <AccordionItem>
                        <AccordionButton pl={4}>
                          <Box flex="1" textAlign="left">
                            {category.name}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                          {renderTranslationInputs(category)}
                          
                          {category.children?.map((subcategory) => (
                            <Box key={subcategory.id} pl={8} mt={4}>
                              <Box fontWeight="medium" mb={2}>
                                {subcategory.name}
                              </Box>
                              {renderTranslationInputs(subcategory)}
                            </Box>
                          ))}
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t("common:cancel")}
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {t("common:save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}