import {
  Switch,
  FormLabel,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Box
} from "@chakra-ui/core";
import React from "react";
import { UseFormMethods } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  isChecked?: boolean;
  hint?: string;
  form: UseFormMethods<any>;
}

const SwitchButton = ({
  name,
  label,
  form,
  mb = 4,
  hint,
  isChecked = false,
  disabled = false,
  ...props
}: ITextBoxProps) => (
  <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
    <Box display="flex" justifyContent="space-between">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Switch
        id={name}
        name={name}
        defaultIsChecked={isChecked}
        ref={form.register}
        isDisabled={disabled}
      />
    </Box>

    <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default SwitchButton;
