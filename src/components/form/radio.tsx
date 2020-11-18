import { FormControl, FormHelperText, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface IRadioProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  options?: any[];
  isInline?: boolean;
  form: UseFormMethods<Record<string, any>>;
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
      <RadioGroup key={name} onChange={setValue} value={value}>
        <Stack direction={isInline ? "row" : "column"} py={2}>
          {options.map((o) => (
            <Radio key={o.value} value={o.value}>
              {o.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default RadioInputField;
