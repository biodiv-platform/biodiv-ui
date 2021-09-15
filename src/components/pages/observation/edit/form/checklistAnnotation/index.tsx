import { Box, Divider, SimpleGrid, Text } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function CheckListAnnotationForm({ fields }) {
  const { t } = useTranslation();
  return (
    <Box>
      <Text mt={4} fontSize="xl" fontWeight="bold">
        📜 {t("observation:checklist_annotation")}
      </Text>
      <Divider mb={4} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={{ base: 0, md: 4 }}>
        {fields.map(({ label }, index) => {
          const fieldName = `checklistAnnotations.${index}.value`;

          return (
            <Box mb={4} key={index}>
              <TextBoxField key={label} name={fieldName} label={label} />
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
