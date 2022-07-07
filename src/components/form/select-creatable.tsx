import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";
import Select from "react-select/creatable";

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
    <FormControl
      isInvalid={fieldState.invalid}
      className="dropdown"
      aria-invalid={fieldState.invalid}
      mb={mb}
      isRequired={isRequired}
      {...props}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>

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
        {...reactSelectProps}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
