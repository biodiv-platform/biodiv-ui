import { FormControl, FormHelperText, FormLabel, Textarea } from "@chakra-ui/react";
import React from "react";
import { UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface ITextAreaProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  form: UseFormMethods<Record<string, any>>;
  style?;
  isRequired?;
}

const TextAreaField = ({
  name,
  label,
  form,
  mb = 4,
  disabled = false,
  hint,
  ...props
}: ITextAreaProps) => (
  <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
    <FormLabel htmlFor={name}>{label}</FormLabel>
    <Textarea
      id={name}
      name={name}
      placeholder={label}
      ref={form.register}
      minH="124px"
      isDisabled={disabled}
      bg="white"
    />
    <ErrorMessage name={name} errors={form.errors} />
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default TextAreaField;
