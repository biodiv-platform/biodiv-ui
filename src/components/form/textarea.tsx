import { Textarea } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "../ui/field";

interface ITextAreaProps {
  name: string;
  label: string;
  placeholder?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  maxLength?;
  style?;
  isRequired?;
}

export const TextAreaField = ({
  name,
  label,
  placeholder,
  mb = 4,
  disabled,
  maxLength,
  hint,
  isRequired,
  ...props
}: ITextAreaProps) => {
  const { field, fieldState } = useController({ name, defaultValue: "" });

  return (
    <Field
      invalid={!!fieldState.error}
      mb={mb}
      htmlFor={name}
      label={label}
      required={isRequired}
      errorText={fieldState?.error?.message}
      {...props}
    >
      <Textarea
        id={name}
        placeholder={placeholder}
        minH="124px"
        disabled={disabled}
        bg="white"
        maxLength={maxLength}
        {...field}
      />
      {maxLength && field.value && (
        <Field color="gray.600" helperText={`${field.value.length}/${maxLength}`} />
      )}
      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
};
