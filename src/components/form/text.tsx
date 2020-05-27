import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/core";
import React from "react";
import { FormContextValues } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  type?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  form: FormContextValues<any>;
  style?;
  isRequired?: boolean;
  showLabel?: boolean;
  hidden?;
}

const TextBoxField = ({
  name,
  label,
  type = "text",
  form,
  mb = 4,
  disabled = false,
  hint,
  isRequired = false,
  showLabel = true,
  hidden = false,
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
      id={name}
      placeholder={label}
      ref={form.register}
      type={type}
      isDisabled={disabled}
    />
    <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default TextBoxField;
