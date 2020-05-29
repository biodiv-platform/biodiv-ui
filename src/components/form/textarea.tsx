import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea
} from "@chakra-ui/core";
import React from "react";
import { FormContextValues } from "react-hook-form";

interface ITextAreaProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  placeholder?: string;
  form: FormContextValues<any>;
  style?;
}

const TextAreaField = ({
  name,
  label,
  form,
  mb = 4,
  disabled = false,
  placeholder,
  hint,
  ...props
}: ITextAreaProps) => (
  <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
    <FormLabel htmlFor={name}>{label}</FormLabel>
    <Textarea
      id={name}
      name={name}
      placeholder={label ? label : placeholder}
      ref={form.register}
      minH="124px"
      isDisabled={disabled}
    />
    <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default TextAreaField;
