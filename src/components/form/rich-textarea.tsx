import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "../ui/field";

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
    <Field invalid={!!fieldState.error} mb={mb} {...props}>
      {label && <Field label={label} />}
      <Box width={"full"}>
        <DefaultEditor placeholder={label} {...field} title={label} />
      </Box>
      <Field errorText={fieldState?.error?.message} />
      {hint && <Field color="gray.600" helperText={hint}></Field>}
    </Field>
  );
};
