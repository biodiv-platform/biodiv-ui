import { CheckboxGroup, Stack } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";

interface ITextBoxProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  mb?: number;
  disabled?: boolean;
}

const CheckboxGroupField = ({
  name,
  label,
  options,
  mb = 4,
  disabled,
  ...props
}: ITextBoxProps) => {
  const { field, fieldState } = useController({ name, defaultValue: [] });

  return (
    <Field
      invalid={!!fieldState.error}
      mb={mb}
      htmlFor="email"
      label={label}
      errorText={fieldState?.error?.message}
      {...props}
    >
      <CheckboxGroup defaultValue={field.value} onChange={field.onChange}>
        <Stack className="custom-checkbox-group">
          {options.map((item) => (
            <Checkbox w="22rem" disabled={disabled} key={item.value} value={item.value}>
              {item.label}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </Field>
  );
};

export default CheckboxGroupField;
