import React from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

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
    <Field
      invalid={!!fieldState.error}
      errorText={fieldState?.error?.message}
      required={isRequired}
      mb={mb}
      htmlFor={name}
      label={label}
      {...props}
    >
      <CheckBoxItems
        options={options}
        defaultValue={field.value}
        onChange={field.onChange}
        type={type}
      />
      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
}
