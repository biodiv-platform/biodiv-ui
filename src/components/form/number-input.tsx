import { HStack, IconButton, NumberInput } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";
import { LuMinus, LuPlus } from "react-icons/lu";

import { Field } from "../ui/field";

interface IRadioProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  disabled?: boolean;
  onChangeCallback?;
}

export const NumberInputField = ({
  name,
  label,
  hint,
  mb = 4,
  disabled,
  onChangeCallback,
  ...props
}: IRadioProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <Field
      invalid={!!fieldState.error}
      mb={mb}
      errorText={fieldState?.error?.message}
      label={label}
      {...props}
    >
      <NumberInput.Root
        value={field.value}
        spinOnPress={false}
        onValueChange={(e) => {
          field.onChange(e.value);
          onChangeCallback && onChangeCallback(e.value);
        }}
        disabled={disabled}
        max={3}
      >
        <HStack gap="2">
          <NumberInput.DecrementTrigger asChild>
            <IconButton variant="outline" size="sm">
              <LuMinus />
            </IconButton>
          </NumberInput.DecrementTrigger>
          <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch" />
          <NumberInput.IncrementTrigger asChild>
            <IconButton variant="outline" size="sm">
              <LuPlus />
            </IconButton>
          </NumberInput.IncrementTrigger>
        </HStack>
      </NumberInput.Root>
      {hint && <Field color="gray.600" helperText={hint}></Field>}
    </Field>
  );
};
