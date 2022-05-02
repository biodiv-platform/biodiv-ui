import { Box, Button } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function LocationEdit({ row }) {
  const { t } = useTranslation();
  const hForm = useFormContext();

  const onTagSelect = (value) => hForm.setValue("curatedLocation", value);

  return (
    <Box p={4} mb={4}>
      <TextBoxField name="curatedLocation" label={t("text-curation:curated.location")} mb={3} />
      {row.locations.map((suggestion: any) => (
        <Button
          variant="outline"
          size="xs"
          bg="blue.50"
          key={suggestion}
          colorScheme="blue"
          borderRadius="3xl"
          onClick={() => onTagSelect(suggestion)}
          mb={2}
          mr={2}
        >
          {suggestion}
        </Button>
      ))}
    </Box>
  );
}
