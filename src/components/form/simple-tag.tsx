import { TagsInput } from "@components/@core/tag-input";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "../ui/field";

interface TagsFieldProps {
  name: string;
  label: string;
  hint?: string;
  mb?;
}

export default function TagsField({ name, label, hint, mb }: TagsFieldProps) {
  const { field, fieldState } = useController({ name });

  return (
    <Field invalid={!!fieldState.error} mb={mb || 4} htmlFor={name} label={label}>
      <TagsInput name={field.name} onChange={field.onChange} onBlur={field.onBlur} />
      <Field children={fieldState?.error?.message} />
      {hint && <Field color="gray.600">{hint}</Field>}
    </Field>
  );
}
