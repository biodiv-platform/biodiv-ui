import { Checkbox, FormControl, FormHelperText } from "@chakra-ui/core";
import React from "react";
import { UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface ITextBoxProps {
  name: string;
  label: string;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  form: UseFormMethods<Record<string, any>>;
}

const CheckboxField = ({ name, label, form, mb = 4, hint, disabled, ...props }: ITextBoxProps) => (
  <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
    <Checkbox name={name} placeholder={label} ref={form.register()} isDisabled={disabled}>
      {label}
    </Checkbox>
    <ErrorMessage name={name} errors={form.errors} />
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default CheckboxField;
