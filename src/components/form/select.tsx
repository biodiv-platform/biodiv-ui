import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/core";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import Select from "react-select";

import ErrorMessage from "./common/error-message";
import { selectStyles } from "./configs";

interface ISelectProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  selectRef?;
  isRequired?: boolean;
  isControlled?: boolean;
  form: UseFormMethods<Record<string, any>>;
}

const SelectInputField = ({
  name,
  label,
  hint,
  form,
  mb = 4,
  options = [],
  disabled = false,
  selectRef,
  isRequired,
  isControlled,
  ...props
}: ISelectProps) => {
  const initialValue = options.find((v) => v.value === form.control.defaultValuesRef.current[name]);

  return (
    <FormControl
      isInvalid={form.errors[name] && true}
      className="dropdown"
      data-select-invalid={form.errors[name] && true}
      mb={mb}
      isRequired={isRequired}
      {...props}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={form.control}
        name={name}
        defaultValue={form.control.defaultValuesRef.current[name]}
        render={({ onChange, onBlur, value }) => (
          <Select
            id={name}
            inputId={name}
            onChange={(o) => onChange(o.value)}
            onBlur={onBlur}
            options={options}
            formatCreateLabel={(v) => `Add "${v}"`}
            {...(isControlled
              ? { value: options.find((o) => o.value === value) }
              : { initialValue })}
            isSearchable={true}
            isDisabled={disabled}
            styles={selectStyles}
            ref={selectRef}
          />
        )}
      />
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default SelectInputField;
