import { Box, Flex } from "@chakra-ui/react";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import React from "react";
import { useFormContext } from "react-hook-form";

import { SelectAsyncInputField } from "@/components/form/select-async";
import { Field } from "@/components/ui/field";

interface TaxonCreateInputFieldProps {
  name: string;
  label: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  mb?: number;
  onValidate?;
  hidden?;
  onRankChange?;
  hint?;
  color?;
}

const POSITION_COLOR = {
  WORKING: "yellow.300",
  CLEAN: "green.300",
  RAW: "gray.300"
};

export const TaxonCreateInputField = ({
  name,
  label,
  isRequired,
  isDisabled,
  hidden,
  onRankChange,
  mb = 4
}: TaxonCreateInputFieldProps) => {
  const {
    formState: { errors },
    watch,
  } = useFormContext();

  const position = watch("metadata." + name);

  return (
    <Field
      invalid={!!errors[name]}
      mb={mb}
      hidden={hidden}
      required={isRequired}
      disabled={isDisabled}
    >
      <Flex width="full" align="center">
        <Flex minW="8rem" align="center" gap={1} flexShrink={0} bgColor={"lightgray"}>
          <Box m={4}>{label}</Box>
          {isRequired && <Box color="red.500">*</Box>}
        </Flex>
        <Box flex={1}>
          <SelectAsyncInputField
            name={name}
            onQuery={(q) => onScientificNameQuery(q, "name")}
            optionComponent={ScientificNameOption}
            placeholder={label}
            resetOnSubmit={false}
            isRaw={true}
            mb={0}
            onChange={(selected) => {
              if (selected) onRankChange?.(selected?.hierarchy);
            }}
            rawKey="label"
            portalled={false}
            bg={POSITION_COLOR[position] || "white!"}
            disabled={isDisabled}
          />
        </Box>
      </Flex>
    </Field>
  );
};
