import { Box, Button } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import useCurateEdit from "../../use-curate-edit";

export default function LocationEdit({ row }) {
  const { t } = useTranslation();
  const { rows } = useCurateEdit();
  const hForm = useFormContext();
  const [suggestions] = useMemo(() => {
    const _suggestions = (row.locations || "")
      .split(",")
      .map((o) => o.trim())
      .filter((o) => !!o);

    return [Array.from(new Set(_suggestions))];
  }, [rows.editing]);

  const onTagSelect = (value) => hForm.setValue("curatedLocation", value);

  return (
    <Box p={4}>
      <TextBoxField name="curatedLocation" label={t("text-curation:curated.location")} mb={3} />
      {suggestions.length > 0 &&
        suggestions.map((suggestion: any) => (
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
