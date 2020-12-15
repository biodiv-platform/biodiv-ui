import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import { isBrowser } from "@static/constants";
import { getByPath } from "@utils/basic";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import Select, { components } from "react-select";

import ErrorMessage from "./common/error-message";
import { ClearIndicator, selectStyles } from "./configs";

interface SelectInputFieldProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  optionComponent?: any;
  selectRef?;
  isRequired?: boolean;
  isControlled?: boolean;
  onChangeCallback?;
  form: UseFormMethods<Record<string, any>>;
}
const DefaultOptionComponent = (p) => <components.Option {...p} />;

const SelectInputField = ({
  name,
  label,
  hint,
  form,
  mb = 4,
  options = [],
  disabled = false,
  selectRef,
  optionComponent = DefaultOptionComponent,
  isRequired,
  isControlled,
  onChangeCallback,
  ...props
}: SelectInputFieldProps) => {
  const initialValue = options.find(
    (v) => v.value === getByPath(form.control.defaultValuesRef.current, name)
  );

  return (
    <FormControl
      isInvalid={getByPath(form.errors, name) && true}
      className="dropdown"
      aria-invalid={getByPath(form.errors, name) && true}
      mb={mb}
      isRequired={isRequired}
      {...props}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={form.control}
        name={name}
        defaultValue={getByPath(form.control.defaultValuesRef.current, name)}
        render={({ onChange, onBlur, value }) => (
          <Select
            id={name}
            inputId={name}
            onChange={(o) => {
              onChange(o.value);
              onChangeCallback && onChangeCallback(o.value);
            }}
            onBlur={onBlur}
            options={options}
            {...(isControlled
              ? { value: options.find((o) => o.value === value) }
              : { defaultValue: initialValue })}
            components={{
              Option: optionComponent,
              ClearIndicator
            }}
            menuPortalTarget={isBrowser && document.body}
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
