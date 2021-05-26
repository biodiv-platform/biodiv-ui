import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import QuillInput from "@components/@core/quill-input";
import React from "react";
import { useController } from "react-hook-form";

interface IRichTextareaProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  isRequired?: boolean;
}

export const RichTextareaField = ({ name, label, hint, mb = 4, ...props }: IRichTextareaProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <FormControl isInvalid={fieldState.invalid} mb={mb} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <QuillInput value={field.value} onChange={field.onChange} />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
