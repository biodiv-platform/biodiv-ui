import { Box, Button, Flex, Tabs, VStack } from "@chakra-ui/react";
import { axGetLangList } from "@services/utility.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

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
      <DialogRoot open={isOpen} onOpenChange={onClose} size="xl">
        <DialogBackdrop />
        <DialogContent maxH="80vh">
          <DialogHeader>{t("admin:species_fields.translations_title")}</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody overflowY="auto">
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
                    {languages.find((l) => l.code === selectedLanguage)?.label || selectedLanguage}
                  </Box>
                  <Box>{t("admin:species_fields.translation_instructions")}</Box>
                </Box>
              </VStack>
            </Flex>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              {t("common:close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
