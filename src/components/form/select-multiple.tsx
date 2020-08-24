import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/core";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import Select from "react-select";

import ErrorMessage from "./common/error-message";
import { selectStyles } from "./configs";

interface SelectMultipleProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  selectRef?;
  isRequired?: boolean;
  isSearchable?: boolean;
  form: UseFormMethods<Record<string, any>>;
}

const SelectMultipleInputField = ({
  name,
  label,
  hint,
  form,
  mb = 4,
  options = [],
  disabled,
  selectRef,
  isRequired,
  isSearchable,
  ...props
}: SelectMultipleProps) => {
  const initialValue = options.filter((v) =>
    (form.control.defaultValuesRef.current[name] || []).includes(v.value)
  );

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
        render={({ onChange, onBlur }) => (
          <Select
            id={name}
            inputId={name}
            onChange={(o) => onChange(o.map(({ value }) => value))}
            onBlur={onBlur}
            options={options}
            formatCreateLabel={(v) => `Add "${v}"`}
            defaultValue={initialValue}
            isSearchable={true}
            isMulti={true}
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

export default SelectMultipleInputField;
