import { FormErrorMessage } from "@chakra-ui/form-control";
import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import { TagsInput } from "@components/@core/tag-input";
import React from "react";
import { useController } from "react-hook-form";

interface TagsFieldProps {
  name: string;
  label: string;
  hint?: string;
  mb?;
}

export default function TagsField({ name, label, hint, mb }: TagsFieldProps) {
  const { field, fieldState } = useController({ name });

  return (
    <FormControl isInvalid={!!fieldState.error} mb={mb || 4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <TagsInput name={field.name} onChange={field.onChange} onBlur={field.onBlur} />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
