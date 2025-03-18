import React from "react";
import { useController } from "react-hook-form";

import { Checkbox } from "../ui/checkbox";
import { Field } from "../ui/field";

interface ITextBoxProps {
  name: string;
  label: string;
  children?;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  hidden?;
}

export const CheckboxField = ({
  name,
  label,
  mb = 4,
  hint,
  disabled,
  children,
  ...props
}: ITextBoxProps) => {
  const {
    field: { onChange, onBlur, value },
    fieldState
  } = useController({ name });

  return (
    <Field invalid={!!fieldState.error} mb={mb} {...props} errorText={fieldState?.error?.message}>
      <Checkbox
        name={name}
        onChange={(e) => onChange(e.target["checked"])}
        onBlur={onBlur}
        defaultChecked={value}
        disabled={disabled}
      >
        {children || label}
      </Checkbox>

      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
};
