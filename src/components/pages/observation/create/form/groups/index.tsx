import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  useRadioGroup
} from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import CustomRadio from "./custom-radio";

interface ISpeciesSelecProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  hideDevider?;
  isRequired?;
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
  hideDevider,
  isRequired = true,
  ...props
}: ISpeciesSelecProps) => {
  const { field, fieldState } = useController({ name });

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    value: field.value ? field.value.toString() : null,
    onChange: field.onChange
  });

  return (
    <>
      <FormControl isInvalid={!!fieldState.error} isRequired={isRequired} mb={mb} {...props}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Box {...getRootProps()}>
          {options.map((o) => (
            <CustomRadio key={o.id} icon={o.name} {...getRadioProps({ value: o.id.toString() })} />
          ))}
        </Box>
        <FormErrorMessage children={fieldState?.error?.message} />
        {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
      </FormControl>
      {!hideDevider && <Divider mb={4} />}
    </>
  );
};

export default GroupSelector;
