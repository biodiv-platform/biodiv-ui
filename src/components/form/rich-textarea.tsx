import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { useController } from "react-hook-form";

const DefaultEditor: any = dynamic(
  () => import("react-simple-wysiwyg").then((m) => m.DefaultEditor),
  { ssr: false }
);

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
    <FormControl isInvalid={!!fieldState.error} mb={mb} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <DefaultEditor placeholder={label} {...field} title={label} />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
