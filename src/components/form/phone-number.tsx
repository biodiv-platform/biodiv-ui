import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { FormContextValues } from "react-hook-form";
import MobileInput from "react-phone-number-input";

interface ISelectProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  defaultCountry?: string;
  onBlur?;
  form: FormContextValues<any>;
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
    form.triggerValidation(name);
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
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default PhoneNumberInputField;
