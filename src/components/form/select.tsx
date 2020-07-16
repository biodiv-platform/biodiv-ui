import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import { FormContextValues } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { selectStyles } from "./configs";

interface ISelectProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  handleChange?;
  selectRef?;
  handleChange?;
  form: FormContextValues<any>;
}

const SelectInputField = ({
  name,
  label,
  hint,
  form,
  mb = 4,
  options = [],
  handleChange,
  disabled = false,
  selectRef,
  ...props
}: ISelectProps) => {
  const initialValue = options.find((v) => v.value === form.control.defaultValuesRef.current[name]);
  const [value, setValue] = useState({});
  const onChange = ({ value }) => {
    if (handleChange) {
      handleChange(value);
    }
    form.setValue(name, value);
    setValue(options.find((v) => v.value === value));
    form.triggerValidation(name);
  };

  useEffect(() => {
    form.register({ name });
    setValue(initialValue);
  }, [form.register, initialValue]);

  return (
    <FormControl
      isInvalid={form.errors[name] && true}
      className="dropdown"
      data-select-invalid={form.errors[name] && true}
      mb={mb}
      {...props}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <CreatableSelect
        inputId={name}
        id={name}
        name={name}
        formatCreateLabel={(v) => `Add "${v}"`}
        options={options}
        defaultValue={initialValue}
        value={value}
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
