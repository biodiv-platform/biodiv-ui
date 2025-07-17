import { Box, Separator, Wrap, WrapItem } from "@chakra-ui/react";
import { RadioCard } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

import CustomRadio from "./custom-radio";

interface ISpeciesSelecProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  hideDevider?: boolean;
  isRequired?: boolean;
}

const GroupSelector = ({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  hideDevider,
  isRequired = true,
  ...props
}: ISpeciesSelecProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <>
      <Field
        invalid={!!fieldState.error}
        errorText={fieldState?.error?.message}
        required={isRequired}
        mb={mb}
        htmlFor={name}
        label={label}
        {...props}
      >
        <RadioCard.Root
          name={name}
          onValueChange={({ value }) => {
            field.onChange(value);
          }}
          align="center"
          colorPalette="blue"
          size="sm"
          value={String(field.value)}
        >
          <Wrap gap={4} justify="flex-start">
            {options?.map((o) => (
              <WrapItem key={o.id}>
                <CustomRadio
                  value={o.id.toString()}
                  icon={o.name}
                  title={o.name}
                  checked={field.value == o.id}
                />
              </WrapItem>
            ))}
          </Wrap>
        </RadioCard.Root>
        {hint && <Field color="gray.600" helperText={hint} />}
      </Field>
      {!hideDevider && (
        <Box mb={4}>
          <Separator />
        </Box>
      )}
    </>
  );
};

export default GroupSelector;
