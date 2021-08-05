import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import { isBrowser } from "@static/constants";
import debounce from "debounce-promise";
import React, { useEffect, useMemo, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import AsyncSelectCreatable from "react-select/async-creatable";

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
  isCreatable?: boolean;
  onChange?;
  eventCallback?;
  selectRef?;
  isRequired?: boolean;
  isClearable?;
  resetOnSubmit?;
}

const dummyOnQuery = (q) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ label: `async-${q}`, value: "vx" }]);
    }, 1000);
  });

const DefaultOptionComponent = (p) => <components.Option {...p} />;

export const SelectAsyncInputField = ({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  multiple = false,
  disabled = false,
  optionComponent = DefaultOptionComponent,
  debounceTime = 200,
  placeholder,
  onChange,
  eventCallback,
  isCreatable=true,
  selectRef,
  isRequired,
  onQuery = dummyOnQuery,
  resetOnSubmit = true,
  isClearable = true,
  ...props
}: ISelectProps) => {
  const form = useFormContext();
  const { field, fieldState } = useController({ name });
  const Select = useMemo(() => (isCreatable ? AsyncSelectCreatable : AsyncSelect), [isCreatable]);

  const onQueryDebounce = debounce(onQuery, debounceTime);
  const [selected, setSelected] = useState(
    field.value ? (multiple ? field.value : { value: field.value }) : null
  );

  useEffect(() => {
    field.onChange(multiple ? selected : selected?.value);
    if (onChange && selected) {
      onChange(selected);
    }
  }, [selected]);

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
      isInvalid={fieldState.invalid}
      aria-invalid={fieldState.invalid}
      isRequired={isRequired}
      mb={mb}
      {...props}
    >
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Select
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
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
