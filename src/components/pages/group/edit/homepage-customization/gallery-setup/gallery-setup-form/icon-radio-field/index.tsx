import React from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

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

  return (
    <Field
      invalid={!!fieldState.error}
      required={isRequired}
      mb={mb}
      errorText={fieldState?.error?.message}
      label={label}
      {...props}
    >
      <RadioItems
        options={options}
        name={name}
        defaultValue={field.value}
        onChange={(o) => {
          field.onChange(o.value);
          onChangeCallback && onChangeCallback(o.value);
        }}
      />
      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
}
