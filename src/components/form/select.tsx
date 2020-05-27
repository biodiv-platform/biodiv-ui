import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/core";
import React, { useEffect } from "react";
import { FormContextValues } from "react-hook-form";
import Select from "react-select";

import { selectStyles } from "./configs";

interface ISelectProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  selectRef?;
  form: FormContextValues<any>;
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
  ...props
}: ISelectProps) => {
  const initialValue = options.find((v) => v.value === form.control.defaultValuesRef.current[name]);

  const onChange = ({ value }) => {
    form.setValue(name, value);
    form.triggerValidation(name);
  };

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  return (
    <FormControl
      isInvalid={form.errors[name] && true}
      className="dropdown"
      data-select-invalid={form.errors[name] && true}
      mb={mb}
      {...props}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select
        inputId={name}
        id={name}
        name={name}
        formatCreateLabel={(v) => `Add "${v}"`}
        options={options}
        defaultValue={initialValue}
        isSearchable={true}
        isDisabled={disabled}
        onChange={onChange}
        styles={selectStyles}
        ref={selectRef}
      />
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default SelectInputField;
