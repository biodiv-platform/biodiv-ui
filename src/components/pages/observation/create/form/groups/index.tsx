import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  useRadioGroup
} from "@chakra-ui/react";
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

/**
 * As radio specs only accepts string to use number wrapper is required
 *
 * @param {ISpeciesSelecProps} {
 *   name,
 *   label,
 *   hint,
 *   mb = 4,
 *   options = [],
 *   form,
 *   ...props
 * }
 * @returns
 */
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

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value: value ? value.toString() : null,
    onChange
  });

  return (
    <>
      <FormControl isInvalid={form.errors[name] && true} isRequired={true} mb={mb} {...props}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Box {...getRootProps()}>
          {options.map((o) => (
            <CustomRadio key={o.id} icon={o.name} {...getRadioProps({ value: o.id.toString() })} />
          ))}
        </Box>
        <ErrorMessage name={name} errors={form.errors} />
        {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
      </FormControl>
      <Divider mb={4} />
    </>
  );
};

export default GroupSelector;
