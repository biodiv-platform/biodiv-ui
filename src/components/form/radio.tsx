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
  onChangeCallback?;
}

export const RadioInputField = ({
  name,
  label,
  hint,
  mb = 4,
  isInline = true,
  colorPalette = "blue",
  options = [],
  onChangeCallback,
  ...props
}: IRadioProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <Field
      invalid={!!fieldState.error}
      mb={mb}
      errorText={fieldState?.error?.message}
      label={label}
      {...props}
    >
      <RadioGroup
        key={name}
        {...field}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          field.onChange(value);
          onChangeCallback && onChangeCallback(value);
        }}
      >
        <Stack direction={isInline ? "row" : "column"} py={2}>
          {options.map((o) => (
            <Radio key={o.value} id={o.value} value={o.value} colorPalette={colorPalette}>
              {o.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      {hint && <Field color="gray.600" helperText={hint}></Field>}
    </Field>
  );
};
