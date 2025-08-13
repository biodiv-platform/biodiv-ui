import { Box, Button, Flex, Tabs, useDisclosure } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import Select from "react-select";

import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";

export default function TranslationTab({ values, setLangId, languages, handleAddTranslation, translationSelected, setTranslationSelected }) {
  const { t } = useTranslation();
  const { open, onClose, onOpen } = useDisclosure();
  return (
    <>
      <DialogRoot open={open} onOpenChange={onClose}>
        <DialogBackdrop />
        <DialogContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleAddTranslation();
              setLangId(0);
              onClose();
            }}
          >
            <DialogHeader> {t("common:create_form.add_translation_button")}</DialogHeader>
            <DialogBody>
              <Box>
                <Field
                  mb={2}
                  required={true}
                  htmlFor="name"
                  label={t("common:create_form.language")}
                >
                  <Select
                    id="langId"
                    inputId="langId"
                    name="langId"
                    placeholder={t("common:create_form.language_placeholder")}
                    onChange={(o: { value: number; label: string }) => {
                      setLangId(o.value);
                    }}
                    components={{
                      IndicatorSeparator: () => null
                    }}
                    options={languages
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((lang) => ({
                        value: lang.id,
                        label: lang.name
                      }))}
                    isSearchable={true} // Enables search
                  />
                </Field>
              </Box>
            </DialogBody>
            <DialogFooter>
              <Button
                mr={3}
                onClick={() => {
                  setLangId(0);
                  onClose();
                }}
              >
                {t("common:create_form.cancel")}
              </Button>
              <Button colorPalette="blue" type="submit">
                {t("common:create_form.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
      <Flex justify="flex-end" width="100%" mb={4} onClick={onOpen}>
        <Button colorPalette="green">{t("common:create_form.add_translation_button")}</Button>
      </Flex>
      <Tabs.Root
        overflowX="auto"
        mb={4}
        bg="gray.100"
        rounded="md"
        variant="plain"
        value={translationSelected.toString()}
        onValueChange={({ value }) => setTranslationSelected(Number(value))}
      >
        <Tabs.List>
          {values.map((language) => (
            <Tabs.Trigger
              key={language}
              value={language.toString()}
              _selected={{ bg: "white", borderRadius: "4", boxShadow: "lg" }}
              m={1}
            >
              {languages.filter((lang) => lang.id === Number(language))[0].name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </>
  );
}
