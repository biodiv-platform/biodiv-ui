import { Flex, FormControl, FormHelperText, FormLabel, Switch } from "@chakra-ui/react";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface ITextBoxProps {
  name: string;
  label: string;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  color?: string;
  hint?: string;
  form: UseFormMethods<Record<string, any>>;
}

const SwitchField = ({
  name,
  label,
  form,
  mb = 4,
  color = "blue",
  hint,
  disabled,
  ...props
}: ITextBoxProps) => (
  <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
    <Flex>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={form.control}
        name={name}
        render={({ onChange, onBlur, value, ref }) => (
          <Switch
            onBlur={onBlur}
            onChange={(e) => onChange(e.target["checked"])}
            defaultIsChecked={value}
            isDisabled={disabled}
            color={color}
            ref={ref}
          />
        )}
      />
    </Flex>
    <ErrorMessage name={name} errors={form.errors} />
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default SwitchField;
