import { Box, Button, CloseButton, Dialog, Flex, Portal, Tabs, VStack } from "@chakra-ui/react";
import { axGetLangList } from "@services/utility.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

interface AddTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: any[];
  onSubmit: (translations: any, language: string) => void;
}

export default function AddTranslationModal({ isOpen, onClose }: AddTranslationModalProps) {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

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

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose} size="xl">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxH="80vh">
              <Dialog.Header>{t("admin:species_fields.translations_title")}</Dialog.Header>
              <Dialog.Body overflowY="auto">
                <Flex direction="column" gap={4}>
                  <Box>
                    <Tabs.Root
                      rounded={"2xl"}
                      colorScheme="green"
                      onChange={() => handleLanguageChange}
                      lazyMount
                    >
                      <Tabs.List overflowX="auto" py={2}>
                        {languages.map((lang) => (
                          <Tabs.Trigger value={lang.code} key={lang.code}>
                            {lang.label}
                          </Tabs.Trigger>
                        ))}
                      </Tabs.List>
                    </Tabs.Root>
                  </Box>

                  <VStack align="stretch" gap={4}>
                    <Box p={4} borderWidth="1px" borderRadius="md">
                      <Box fontWeight="bold" mb={2}>
                        {t("admin:species_fields.selected_language")}:{" "}
                        {languages.find((l) => l.code === selectedLanguage)?.label ||
                          selectedLanguage}
                      </Box>
                      <Box>{t("admin:species_fields.translation_instructions")}</Box>
                    </Box>
                  </VStack>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="subtle"> {t("common:cancel")}</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
