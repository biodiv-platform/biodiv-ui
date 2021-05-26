import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import CheckBoxItems from "./checkbox";

interface CheckboxProps {
  name: string;
  label: string;
  type: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  isRequired?: boolean;
}

export default function IconCheckboxField({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  type,
  isRequired,
  ...props
}: CheckboxProps) {
  const { field, fieldState } = useController({ name });

  return (
    <FormControl isInvalid={fieldState.invalid} isRequired={isRequired} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <CheckBoxItems
        options={options}
        defaultValue={field.value}
        onChange={field.onChange}
        type={type}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
