import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/core";
import ErrorMessage from "@components/form/common/error-message";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";

import CheckBoxItems from "./checkbox";

interface CheckboxProps {
  name: string;
  label: string;
  type: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  form: UseFormMethods<Record<string, any>>;
  isRequired?: boolean;
}

export default function IconCheckboxField({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  form,
  type,
  isRequired,
  ...props
}: CheckboxProps) {
  return (
    <FormControl isInvalid={form.errors[name] && true} isRequired={isRequired} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={form.control}
        name={name}
        defaultValue={form.control.defaultValuesRef.current[name]}
        render={({ onChange, value }) => (
          <CheckBoxItems options={options} defaultValue={value} onChange={onChange} type={type} />
        )}
      />
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
