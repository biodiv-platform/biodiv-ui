import { Flex, FormControl, FormHelperText, FormLabel, Switch } from "@chakra-ui/core";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";

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

const SwitchField = ({ name, label, form, mb = 4, hint, disabled, ...props }: ITextBoxProps) => (
  <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
    <Flex align="center">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={form.control}
        name={name}
        render={({ onChange, onBlur, value }) => (
          <Switch
            onBlur={onBlur}
            onChange={(e) => onChange(e.target["checked"])}
            defaultIsChecked={value}
            isDisabled={disabled}
            color="green"
          />
        )}
      />
    </Flex>
    <ErrorMessage name={name} errors={form.errors} />
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default SwitchField;
