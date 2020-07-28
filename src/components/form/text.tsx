import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/core";
import React from "react";
import { FormContextValues } from "react-hook-form";

interface ITextBoxProps {
  id?: string;
  name: string;
  label: string;
  type?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  isReadOnly?: boolean;
  form: FormContextValues<any>;
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
  isReadOnly,
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
      isReadOnly={isReadOnly}
      ref={form.register}
      type={type}
      isDisabled={disabled}
    />
    <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default TextBoxField;
