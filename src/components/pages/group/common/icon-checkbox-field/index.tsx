import React, { useState, useEffect } from "react";
import { FormContextValues } from "react-hook-form";
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from "@chakra-ui/core";
import CheckBoxItems from "./checkbox";

interface CheckboxProps {
  name: string;
  label: string;
  type: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  form: FormContextValues<any>;
}

export default function IconCheckboxField({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  form,
  type,
  ...props
}: CheckboxProps) {
  const [species, setSpecies] = useState(form.control.defaultValuesRef.current[name] || []);

  const onChange = (id) => {
    setSpecies(id);
    form.setValue(name, [...id, ...species]);
  };

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  return (
    <FormControl isInvalid={form.errors[name] && true} isRequired={true} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <CheckBoxItems values={options} defaultValue={species} onUpdate={onChange} type={type} />
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
