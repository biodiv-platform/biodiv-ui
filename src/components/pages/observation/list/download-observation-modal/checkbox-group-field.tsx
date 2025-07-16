import { Checkbox, CheckboxGroup, Fieldset, Stack } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  mb?: number;
  disabled?: boolean;
  colorPalette?: string;
}

const CheckboxGroupField = ({
  name,
  label,
  options,
  mb = 4,
  disabled,
  colorPalette = "blue",
  ...props
}: ITextBoxProps) => {
  const { field, fieldState } = useController({ name, defaultValue: [] });

  return (
    <Fieldset.Root invalid={!!fieldState.error} mb={mb} {...props}>
      <Fieldset.Legend>{label}</Fieldset.Legend>
      <CheckboxGroup
        value={field.value}
        onValueChange={field.onChange}
        name={field.name}
        colorPalette={colorPalette}
      >
        <Fieldset.Content>
          <Stack className="custom-checkbox-group">
            {options.map((item) => (
              <Checkbox.Root w="22rem" key={item.value} value={item.value} disabled={disabled}>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{item.label}</Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Stack>
        </Fieldset.Content>
        {fieldState.error && <Fieldset.ErrorText>{fieldState?.error?.message}</Fieldset.ErrorText>}
      </CheckboxGroup>
    </Fieldset.Root>
  );
};

export default CheckboxGroupField;
