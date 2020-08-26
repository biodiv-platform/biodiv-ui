import { Box, FormControl, FormHelperText, FormLabel, Switch } from "@chakra-ui/core";
import React from "react";
import { UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface ITextBoxProps {
  name: string;
  label: string;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  isChecked?: boolean;
  hint?: string;
  form: UseFormMethods<Record<string, any>>;
}

const SwitchButton = ({
  name,
  label,
  form,
  mb = 4,
  hint,
  disabled = false,
  ...props
}: ITextBoxProps) => (
  <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
    <Box display="flex" justifyContent="space-between">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Switch
        id={name}
        name={name}
        defaultIsChecked={form.control.defaultValuesRef.current[name]}
        ref={form.register}
        isDisabled={disabled}
      />
    </Box>

    <ErrorMessage name={name} errors={form.errors} />
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default SwitchButton;
