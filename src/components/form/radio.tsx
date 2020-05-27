import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup
} from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { FormContextValues } from "react-hook-form";

interface IRadioProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  options?: any[];
  isInline?: boolean;
  form: FormContextValues<any>;
}

const RadioInputField = ({
  name,
  label,
  hint,
  form,
  mb = 4,
  isInline = true,
  options = [],
  ...props
}: IRadioProps) => {
  const [value, setValue] = useState(form.control.defaultValuesRef.current[name]);

  useEffect(() => {
    form.setValue(name, value);
  }, [value]);

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        key={name}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        py={2}
        isInline={isInline}
      >
        {options.map((o) => (
          <Radio key={o.value} value={o.value}>
            {o.label}
          </Radio>
        ))}
      </RadioGroup>
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default RadioInputField;
