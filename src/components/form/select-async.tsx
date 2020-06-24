import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/core";
import { isBrowser } from "@static/constants";
import debounce from "debounce-promise";
import React, { useEffect, useState } from "react";
import { FormContextValues } from "react-hook-form";
import { components } from "react-select";
import AsyncSelect from "react-select/async-creatable";

import { ClearIndicator, selectStyles } from "./configs";

interface ISelectProps {
  name: string;
  label?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  options?: any[];
  multiple?: boolean;
  style?: any;
  onQuery?: any;
  debounceTime?: number;
  optionComponent?: any;
  placeholder?: string;
  onChange?;
  eventCallback?;
  selectRef?;
  isClearable?;
  form: FormContextValues<any>;
  resetOnSubmit?;
}

const dummyOnQuery = (q) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ label: `async-${q}`, value: "vx" }]);
    }, 1000);
  });

const DefaultOptionComponent = (p) => <components.Option {...p} />;

const SelectAsyncInputField = ({
  name,
  label,
  hint,
  form,
  mb = 4,
  options = [],
  multiple = false,
  disabled = false,
  optionComponent = DefaultOptionComponent,
  debounceTime = 200,
  placeholder,
  onChange,
  eventCallback,
  selectRef,
  onQuery = dummyOnQuery,
  resetOnSubmit = true,
  isClearable = true,
  ...props
}: ISelectProps) => {
  const initialValue = form.control.defaultValuesRef.current[name];
  const onQueryDebounce = debounce(onQuery, debounceTime);
  const [selected, setSelected] = useState(
    initialValue ? (multiple ? initialValue : { value: initialValue }) : null
  );

  useEffect(() => {
    form.setValue(name, multiple ? selected : selected?.value);
    form.triggerValidation(name);
    if (onChange && selected) {
      onChange(selected);
    }
  }, [selected]);

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  const handleOnChange = (value, event) => {
    eventCallback ? eventCallback(value, event, setSelected) : setSelected(value);
  };

  useEffect(() => {
    if (resetOnSubmit && form.formState.submitCount) {
      setSelected(multiple ? [] : null);
    }
  }, [form.formState.submitCount]);

  return (
    <FormControl
      isInvalid={form.errors[name] && true}
      data-select-invalid={form.errors[name] && true}
      mb={mb}
      {...props}
    >
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <AsyncSelect
        name={name}
        inputId={name}
        menuPortalTarget={isBrowser && document.body}
        formatCreateLabel={(v) => `Add "${v}"`}
        isMulti={multiple}
        defaultOptions={options}
        loadOptions={onQueryDebounce}
        components={{
          Option: optionComponent,
          ClearIndicator,
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null
        }}
        value={selected}
        isSearchable={true}
        isDisabled={disabled}
        isClearable={isClearable}
        onChange={handleOnChange}
        placeholder={placeholder || label}
        noOptionsMessage={() => null}
        styles={selectStyles}
        ref={selectRef}
      />
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default SelectAsyncInputField;
