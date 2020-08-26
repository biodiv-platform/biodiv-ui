import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/core";
import { getByPath } from "@utils/basic";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import Select, { components } from "react-select";

import ErrorMessage from "./common/error-message";
import { ClearIndicator, selectStyles } from "./configs";

interface SelectMultipleProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  optionComponent?: any;
  selectRef?;
  isRequired?: boolean;
  isSearchable?: boolean;
  form: UseFormMethods<Record<string, any>>;
}

const DefaultOptionComponent = (p) => <components.Option {...p} />;

const SelectMultipleInputField = ({
  name,
  label,
  hint,
  form,
  mb = 4,
  optionComponent = DefaultOptionComponent,
  options = [],
  disabled,
  selectRef,
  isRequired,
  isSearchable,
  ...props
}: SelectMultipleProps) => {
  const initialValue = options.filter((v) =>
    (getByPath(form.control.defaultValuesRef.current, name) || []).includes(v.value)
  );

  return (
    <FormControl
      isInvalid={getByPath(form.errors, name) && true}
      className="dropdown"
      data-select-invalid={getByPath(form.errors, name) && true}
      mb={mb}
      isRequired={isRequired}
      {...props}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={form.control}
        name={name}
        defaultValue={getByPath(form.control.defaultValuesRef.current, name)}
        render={({ onChange, onBlur }) => (
          <Select
            id={name}
            inputId={name}
            onChange={(o) => onChange(o ? o.map(({ value }) => value) : [])}
            onBlur={onBlur}
            options={options}
            components={{
              Option: optionComponent,
              ClearIndicator
            }}
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
