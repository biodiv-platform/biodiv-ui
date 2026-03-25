"use client";

import { Field, TagsInput } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

interface TagsFieldProps {
  name: string;
  label?: string;
  hint?: string;
  placeholder?: string;

  numericOnly?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidate?: (value: string) => boolean;
}

export default function TagsNextField({
  name,
  label,
  hint,
  placeholder,
  numericOnly,
  minLength,
  maxLength,
  pattern,
  customValidate
}: TagsFieldProps) {
  const { field, fieldState } = useController({ name });

  const validateTag = (details: any) => {
    const value = details.inputValue.trim();

    if (!value) return false;

    if (numericOnly && !/^\d+$/.test(value)) return false;

    if (minLength && value.length < minLength) return false;

    if (maxLength && value.length > maxLength) return false;

    if (pattern && !pattern.test(value)) return false;

    if (customValidate && !customValidate(value)) return false;

    return true;
  };

  return (
    <Field.Root invalid={!!fieldState.error}>
      <TagsInput.Root
        value={field.value || []}
        onValueChange={(details) => field.onChange(details.value)}
        validate={validateTag}
      >
        <TagsInput.Label>{label}</TagsInput.Label>

        <TagsInput.Control >
          <TagsInput.Items />
          <TagsInput.Input placeholder={placeholder} onBlur={field.onBlur} />
        </TagsInput.Control>
      </TagsInput.Root>

      {fieldState.error && <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>}

      {hint && <Field.HelperText>{hint}</Field.HelperText>}
    </Field.Root>
  );
}
