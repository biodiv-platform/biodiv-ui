import { Box } from "@chakra-ui/react";
import { MENU_PORTAL_TARGET } from "@static/constants";
import debounce from "debounce-promise";
import React, { useEffect, useMemo, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { LuChevronDown } from "react-icons/lu";
import { components, DropdownIndicatorProps } from "react-select";
import AsyncSelect from "react-select/async";
import AsyncSelectCreatable from "react-select/async-creatable";

import { Field } from "../ui/field";
import { ClearIndicator, reactSelectProps } from "./configs";

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
  isRaw?;
  openMenuOnFocus?: boolean;
  portalled?: boolean;
  rawKey?: string;
  bg?;
  icon?: React.ReactNode;
}
const dummyOnQuery = (q) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ label: `async-${q}`, value: "vx" }]);
    }, 1000);
  });

const DefaultOptionComponent = (p: any) => <components.Option {...p} />;

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <LuChevronDown />
    </components.DropdownIndicator>
  );
};

const SingleValue = ({ children, ...props }: any) => {
  return <components.SingleValue {...props}>{children}</components.SingleValue>;
};

const ValueContainer = ({ children, ...props }: any) => {
  const { icon, isDisabled } = props.selectProps;
  const hasValue = props.hasValue;

  return (
    <components.ValueContainer {...props}>
      <Box display="flex" alignItems="center" width="100%">
        {children}
        {icon && hasValue && !isDisabled && (
          <Box as="span" ml={1} display="inline-flex" alignItems="center" flexShrink={0}>
            {icon}
          </Box>
        )}
      </Box>
    </components.ValueContainer>
  );
};

export const SelectAsyncInputField = ({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  multiple,
  disabled,
  optionComponent = DefaultOptionComponent,
  debounceTime = 200,
  placeholder,
  onChange,
  eventCallback,
  isCreatable = true,
  selectRef,
  isRequired,
  onQuery = dummyOnQuery,
  resetOnSubmit = true,
  isClearable = true,
  isRaw,
  openMenuOnFocus = false,
  portalled = true,
  rawKey,
  bg = "white!",
  icon,
  ...props
}: ISelectProps) => {
  const form = useFormContext();
  const { field, fieldState } = useController({ name });
  const Select: any = useMemo(
    () => (isCreatable ? AsyncSelectCreatable : AsyncSelect),
    [isCreatable]
  );

  const onQueryDebounce = debounce(onQuery, debounceTime);
  const getInitialSelected = (value) => {
    if (!value) return null;
    if (multiple) return value;
    if (isRaw) return typeof value === "string" ? { value, label: value } : value;
    return typeof value === "string" ? { value, label: value } : { value }; // add label here
  };

  const [selected, setSelected] = useState(getInitialSelected(field.value));

  const isMounted = React.useRef(false);

  const isExternalUpdate = React.useRef(false);

  const isFirstSync = React.useRef(true);

  useEffect(() => {
    if (isFirstSync.current) {
      isFirstSync.current = false;
      return;
    }
    if (field.value !== undefined && field.value?.value !== selected?.value) {
      isExternalUpdate.current = true;
      setSelected(getInitialSelected(field.value));
    }
  }, [field.value]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false;
      return;
    }

    field.onChange(multiple ? selected : isRaw ? selected?.value : selected?.value);
    if (onChange && selected) {
      onChange(selected);
    }
  }, [selected]);

  const handleOnChange = (value, event) => {
    if (onChange) onChange(value); // full option with hierarchy
    eventCallback
      ? eventCallback(value, event, setSelected)
      : setSelected(
          value === null
            ? null
            : rawKey
            ? { value: value?.[rawKey], label: value?.[rawKey] }
            : value
        );
  };

  useEffect(() => {
    if (resetOnSubmit && form.formState.submitCount) {
      setSelected(multiple ? [] : null);
    }
  }, [form.formState.submitCount]);

  return (
    <Field
      invalid={!!fieldState.error}
      aria-invalid={!!fieldState.error}
      mb={mb}
      required={isRequired}
      htmlFor={name}
      errorText={fieldState?.error?.message}
      label={label}
      {...props}
    >
      <Box width={"full"} bg={bg}>
        <Select
          name={name}
          inputId={name}
          menuPortalTarget={portalled && MENU_PORTAL_TARGET}
          formatCreateLabel={(v) => `Add "${v}"`}
          isMulti={multiple}
          defaultOptions={options}
          loadOptions={onQueryDebounce}
          components={{
            Option: optionComponent,
            ClearIndicator,
            DropdownIndicator,
            IndicatorSeparator: () => null,
            SingleValue,
            ValueContainer
          }}
          value={selected}
          isSearchable={true}
          isDisabled={disabled}
          isClearable={isClearable}
          onChange={handleOnChange}
          placeholder={placeholder || label}
          noOptionsMessage={() => null}
          ref={selectRef}
          openMenuOnFocus={openMenuOnFocus}
          icon={icon}
          {...reactSelectProps}
          styles={{
            control: (base) => ({
              ...base,
              background: bg ? `var(--chakra-colors-${bg.replace(".", "-")})` : base.background
            })
          }}
        />
      </Box>
      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
};
