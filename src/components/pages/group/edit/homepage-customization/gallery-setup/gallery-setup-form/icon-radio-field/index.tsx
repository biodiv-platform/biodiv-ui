import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/core";
import ErrorMessage from "@components/form/common/error-message";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";

import CheckBoxItems from "./radio";

interface CheckboxProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  form: UseFormMethods<Record<string, any>>;
  isRequired?: boolean;
}

export default function IconRadioField({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  form,
  isRequired,
  ...props
}: CheckboxProps) {
  const handleChange = (value) => {
    form.setValue(name, value);
  };

  return (
    <FormControl isInvalid={form.errors[name] && true} isRequired={isRequired} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={form.control}
        name={name}
        defaultValue={form.control.defaultValuesRef.current[name]}
        render={({ value }) => (
          <CheckBoxItems
            options={options}
            form={form}
            name={name}
            defaultValue={value}
            onChange={handleChange}
          />
        )}
      />
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
