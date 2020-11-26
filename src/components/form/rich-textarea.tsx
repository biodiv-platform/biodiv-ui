import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import QuillInput from "@components/@core/quill-input";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface IRichTextareaProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  isRequired?: boolean;
  form: UseFormMethods<Record<string, any>>;
}

const RichTextareaField = ({ name, label, hint, form, mb = 4, ...props }: IRichTextareaProps) => {
  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <Controller
        control={form.control}
        name={name}
        defaultValue={form.control.defaultValuesRef.current[name]}
        render={({ value, onChange }) => <QuillInput value={value} onChange={onChange} />}
      />
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default RichTextareaField;
