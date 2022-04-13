import { Box, Button } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import useTranslation from "next-translate/useTranslation";
import React, { useRef } from "react";

export default function ScientificNameEdit({ row }) {
  const { t } = useTranslation();
  const scientificRef: any = useRef(null);

  const onSciNameQuery = async (q) => await onScientificNameQuery(q, "name");

  const onTagSelect = (value) => {
    scientificRef.current.onChange(
      { value: value, label: value },
      { name: scientificRef.current.props.inputId }
    );
  };

  return (
    <Box p={4} pb={0} mb={6}>
      <SelectAsyncInputField
        resetOnSubmit={false}
        name="curatedSName"
        label={t("text-curation:curated.sci_name")}
        placeholder={t("observation:scientific_name")}
        onQuery={onSciNameQuery}
        optionComponent={ScientificNameOption}
        selectRef={scientificRef}
        isRaw={true}
        mb={3}
      />

      {row.scientificNames.map((suggestion) => (
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
