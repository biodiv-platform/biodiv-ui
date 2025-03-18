import { Flex } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

import { Field } from "../ui/field";
import { Switch } from "../ui/switch";

interface ITextBoxProps {
  name: string;
  label: string;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  color?: string;
  hint?: string;
}

export const SwitchField = ({
  name,
  label,
  mb = 4,
  color = "blue",
  hint,
  disabled,
  ...props
}: ITextBoxProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <Field invalid={!!fieldState.error} mb={mb} {...props}>
      <Flex>
        <Field htmlFor={name} label={label} />
        <Switch
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e.target["checked"])}
          defaultChecked={field.value}
          disabled={disabled}
          colorPalette={color}
          name={name}
        />
      </Flex>
      <Field errorText={fieldState?.error?.message} />
      {hint && <Field color="gray.600" helperText={hint}></Field>}
    </Field>
  );
};
