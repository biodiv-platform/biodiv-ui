import {
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  Stack
} from "@chakra-ui/core";
import ErrorMessage from "@components/form/common/error-message";
import React, { useEffect } from "react";
import { UseFormMethods } from "react-hook-form";

import CustomRadio from "./custom-radio";

interface ISpeciesSelecProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  form: UseFormMethods<Record<string, any>>;
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
    form.setValue(name, v, { shouldDirty: true, shouldValidate: true });
  };

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  return (
    <>
      <FormControl isInvalid={form.errors[name] && true} isRequired={true} mb={mb} {...props}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <RadioGroup id={name} value={value} onChange={onChange}>
          <Stack direction="row" py={2}>
            {options.map((o) => (
              <CustomRadio key={o.id} value={o.id} icon={o.name} />
            ))}
          </Stack>
        </RadioGroup>
        <ErrorMessage name={name} errors={form.errors} />
        {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
      </FormControl>
      <Divider mb={4} />
    </>
  );
};

export default GroupSelector;
