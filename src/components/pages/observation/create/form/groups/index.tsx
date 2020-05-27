import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  RadioButtonGroup
} from "@chakra-ui/core";
import React, { useEffect } from "react";
import { FormContextValues } from "react-hook-form";

import CustomRadio from "./custom-radio";

interface ISpeciesSelecProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  form: FormContextValues<any>;
}

const GroupSelector = ({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  form,
  ...props
}: ISpeciesSelecProps) => {
  const value = form.watch(name);

  const onChange = (v) => {
    form.setValue(name, v);
  };

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  return (
    <>
      <FormControl isInvalid={form.errors[name] && true} isRequired={true} mb={mb} {...props}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <RadioButtonGroup id={name} value={value} onChange={onChange} isInline>
          {options.map((o) => (
            <CustomRadio key={o.id} value={o.id} icon={o.name} />
          ))}
        </RadioButtonGroup>
        <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
        {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
      </FormControl>
      <Divider mb={4} />
    </>
  );
};

export default GroupSelector;
