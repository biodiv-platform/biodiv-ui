import { Checkbox, FormControl, FormErrorMessage, FormHelperText } from "@chakra-ui/core";
import React from "react";
import { FormContextValues } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  isReadOnly?: boolean;
  hint?: string;
  form: FormContextValues<any>;
}

const CheckboxField = ({
  name,
  label,
  form,
  mb = 4,
  hint,
  disabled = false,
  isReadOnly = false,
  ...props
}: ITextBoxProps) => (
  <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
    <Checkbox
      name={name}
      placeholder={label}
      ref={form.register}
      isReadOnly={isReadOnly}
      isDisabled={disabled}
    >
      {label}
    </Checkbox>
    <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default CheckboxField;
