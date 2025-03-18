import React from "react";
import { useController } from "react-hook-form";
import Select from "react-select/creatable";

import { Field } from "../ui/field";
import { reactSelectProps } from "./configs";

interface ISelectCreatableProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  selectRef?;
  isRequired?: boolean;
  isControlled?: boolean;
  onChangeCallback?;
}

export const SelectCreatableInputField = ({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  disabled = false,
  selectRef,
  isRequired,
  isControlled,
  onChangeCallback,
  ...props
}: ISelectCreatableProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <Field
      invalid={!!fieldState.error}
      className="dropdown"
      aria-invalid={!!fieldState.error}
      mb={mb}
      required={isRequired}
      {...props}
    >
      <Field htmlFor={name} label={label} />

      <Select
        id={name}
        inputId={name}
        onChange={(o) => {
          field.onChange(o.value);
          onChangeCallback && onChangeCallback(o.value);
        }}
        onBlur={field.onBlur}
        options={options}
        formatCreateLabel={(v) => `Add "${v}"`}
        {...{
          [isControlled ? "value" : "defaultValue"]: options.find((o) => o.value === field.value)
        }}
        isSearchable={true}
        isDisabled={disabled}
        ref={selectRef}
        components={{ IndicatorSeparator: () => null }}
        {...reactSelectProps}
      />
      <Field errorText={fieldState?.error?.message} />
      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
};
