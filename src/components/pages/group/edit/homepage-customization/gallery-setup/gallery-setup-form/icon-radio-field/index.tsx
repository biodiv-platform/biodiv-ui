import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import RadioItems from "./radio";

interface CheckboxProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  isRequired?: boolean;
  onChangeCallback?;
}

export default function IconRadioField({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  isRequired,
  onChangeCallback,
  ...props
}: CheckboxProps) {
  const { field, fieldState } = useController({ name });

  const handleChange = (value) => {
    field.onChange(value);
    if (onChangeCallback) {
      onChangeCallback(value);
    }
  };

  return (
    <FormControl isInvalid={!!fieldState.error} isRequired={isRequired} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <RadioItems
        options={options}
        name={name}
        defaultValue={field.value}
        onChange={handleChange}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
