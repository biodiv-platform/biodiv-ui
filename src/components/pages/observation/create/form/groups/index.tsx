import { Box, Separator } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { useRadioGroup } from "@/hooks/use-radio-group";

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
      <Field
        invalid={!!fieldState.error}
        errorText={fieldState?.error?.message}
        required={isRequired}
        mb={mb}
        htmlFor={name}
        label={label}
        {...props}
      >
        <Field></Field>
        <Box {...getRootProps()}>
          {options.map((o) => (
            <CustomRadio key={o.id} icon={o.name} {...getRadioProps({ value: o.id.toString() })} />
          ))}
        </Box>
        {hint && <Field color="gray.600" helperText={hint} />}
      </Field>
      {!hideDevider && <Separator mb={4} />}
    </>
  );
};

export default GroupSelector;
