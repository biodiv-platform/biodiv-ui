import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/core";
import React from "react";
import { UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface ITextBoxProps {
  id?: string;
  name: string;
  label: string;
  type?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  form: UseFormMethods<Record<string, any>>;
  style?;
  isRequired?: boolean;
  showLabel?: boolean;
  hidden?;
}

const TextBoxField = ({
  id,
  name,
  label,
  type = "text",
  form,
  mb = 4,
  disabled,
  hint,
  isRequired,
  showLabel = true,
  hidden,
  ...props
}: ITextBoxProps) => (
  <FormControl
    isInvalid={form.errors[name] && true}
    mb={mb}
    hidden={hidden}
    isRequired={isRequired}
    {...props}
  >
    {showLabel && <FormLabel htmlFor={name}>{label}</FormLabel>}
    <Input
      name={name}
      id={id || name}
      placeholder={label}
      ref={form.register}
      type={type}
      isDisabled={disabled}
    />
    <ErrorMessage name={name} errors={form.errors} />
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default TextBoxField;
