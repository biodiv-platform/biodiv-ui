import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";
import Select, { components } from "react-select";

import { ClearIndicator, reactSelectProps } from "./configs";

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
}

const DefaultOptionComponent = (p: any) => <components.Option {...p} />;

export const SelectMultipleInputField = ({
  name,
  label,
  hint,
  mb = 4,
  optionComponent = DefaultOptionComponent,
  options = [],
  disabled,
  selectRef,
  isRequired,
  isSearchable,
  ...props
}: SelectMultipleProps) => {
  const { field, fieldState } = useController({ name });
  const initialValue = options.filter((v) => (field.value || []).includes(v.value));

  return (
    <FormControl
      isInvalid={!!fieldState.error}
      className="dropdown"
      aria-invalid={!!fieldState.error}
      mb={mb}
      isRequired={isRequired}
      {...props}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select
        id={name}
        inputId={name}
        onChange={(o) => field.onChange(o ? o.map(({ value }) => value) : [])}
        onBlur={field.onBlur}
        options={options}
        components={{
          Option: optionComponent,
          ClearIndicator,
          IndicatorSeparator: () => null
        }}
        defaultValue={initialValue}
        isSearchable={true}
        isMulti={true}
        isDisabled={disabled}
        ref={selectRef}
        {...reactSelectProps}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
