import { Stack } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "../ui/field";
import { Radio, RadioGroup } from "../ui/radio";

interface IRadioProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  options?: any[];
  isInline?: boolean;
  colorPalette?: string;
}

export const RadioInputField = ({
  name,
  label,
  hint,
  mb = 4,
  isInline = true,
  colorPalette = "blue",
  options = [],
  ...props
}: IRadioProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <Field invalid={!!fieldState.error} mb={mb} {...props}>
      {label && <Field label={label} />}
      <RadioGroup key={name} {...field}>
        <Stack direction={isInline ? "row" : "column"} py={2}>
          {options.map((o) => (
            <Radio key={o.value} id={o.value} value={o.value} colorPalette={colorPalette}>
              {o.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      <Field errorText={fieldState?.error?.message} />
      {hint && <Field color="gray.600" helperText={hint}></Field>}
    </Field>
  );
};
