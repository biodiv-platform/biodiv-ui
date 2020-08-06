import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { UseFormMethods } from "react-hook-form";
import MobileInput from "react-phone-number-input";

import ErrorMessage from "./common/error-message";

interface ISelectProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  defaultCountry?: string;
  onBlur?;
  form: UseFormMethods<Record<string, any>>;
}

const PhoneNumberInputField = ({
  name,
  label,
  hint,
  form,
  mb = 4,
  defaultCountry = "IN",
  disabled = false,
  ...props
}: ISelectProps) => {
  const [value, setValue] = useState(form.control.defaultValuesRef.current[name]);

  useEffect(() => {
    form.setValue(name, value);
  }, [value]);

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  const handleOnBlur = () => {
    form.trigger(name);
  };

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <MobileInput
        id={name}
        name={name}
        inputComponent={Input}
        countrySelectProps={{ unicodeFlags: true }}
        defaultCountry={defaultCountry}
        value={value}
        onChange={setValue}
        onBlur={handleOnBlur}
        disabled={disabled}
      />
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default PhoneNumberInputField;
