import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  Tabs,
  VStack
} from "@chakra-ui/react";
import { axGetLangList } from "@services/utility.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import BulkTranslateModal from "./bulk-translate-modal";

interface AddTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: any[];
  onSubmit: (translations: any, language: string) => void;
}

export default function AddTranslationModal({
  isOpen,
  onClose,
  fields,
  onSubmit
}: AddTranslationModalProps) {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Fetch available languages
  useEffect(() => {
    if (isOpen) {
      axGetLangList().then(({ data }) =>
        setLanguages(data.map((l) => ({ label: l.name, value: l.id, code: l.twoLetterCode })))
      );
    }
  }, [isOpen]);

  const handleLanguageChange = (index: number) => {
    if (languages[index]) {
      setSelectedLanguage(languages[index].code);
    }
  };

  const handleBulkTranslate = () => {
    setIsBulkModalOpen(true);
  };

  const handleBulkSubmit = (translations: any) => {
    onSubmit(translations, selectedLanguage);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxH="80vh">
          <ModalHeader>{t("admin:species_fields.translations_title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto">
            <Flex direction="column" gap={4}>
              <Box>
                <Tabs 
                  variant="soft-rounded" 
                  colorScheme="green" 
                  onChange={handleLanguageChange}
                  isLazy
                >
                  <TabList overflowX="auto" py={2}>
                    {languages.map((lang) => (
                      <Tab key={lang.code}>{lang.label}</Tab>
                    ))}
                  </TabList>
                </Tabs>
              </Box>
              
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Button 
                    colorScheme="blue" 
                    onClick={handleBulkTranslate}
                    isDisabled={languages.length === 0}
                  >
                    {t("admin:species_fields.bulk_translate")}
                  </Button>
                </Box>
                
                <Box p={4} borderWidth="1px" borderRadius="md">
                  <Box fontWeight="bold" mb={2}>
                    {t("admin:species_fields.selected_language")}: {
                      languages.find(l => l.code === selectedLanguage)?.label || selectedLanguage
                    }
                  </Box>
                  <Box>
                    {t("admin:species_fields.translation_instructions")}
                  </Box>
                </Box>
              </VStack>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              {t("common:close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <BulkTranslateModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        fields={fields}
        onSubmit={handleBulkSubmit}
        selectedLanguage={selectedLanguage}
      />
    </>
  );
} 