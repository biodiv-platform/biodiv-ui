import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import { MENU_PORTAL_TARGET } from "@static/constants";
import React from "react";
import { useController } from "react-hook-form";
import Select, { components } from "react-select";

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
  shouldPortal?;
  hidden?;
}
const DefaultOptionComponent = (p: any) => <components.Option {...p} />;

export const SelectInputField = ({
  name,
  label,
  hint,
  mb = 4,
  options = [],
  disabled,
  selectRef,
  optionComponent = DefaultOptionComponent,
  isRequired,
  isControlled,
  shouldPortal,
  onChangeCallback,
  hidden,
  ...props
}: SelectInputFieldProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <FormControl
      isInvalid={fieldState.invalid}
      className="dropdown"
      aria-invalid={fieldState.invalid}
      mb={mb}
      hidden={hidden}
      isRequired={isRequired}
      {...props}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select
        id={name}
        inputId={name}
        onChange={(o) => {
          field.onChange(o.value);
          onChangeCallback && onChangeCallback(o.value);
        }}
        onBlur={field.onBlur}
        options={options}
        components={{
          Option: optionComponent,
          ClearIndicator
        }}
        menuPortalTarget={shouldPortal ? MENU_PORTAL_TARGET : undefined}
        isSearchable={true}
        isDisabled={disabled}
        styles={selectStyles}
        {...{
          [isControlled ? "value" : "defaultValue"]: options.find((o) => o.value === field.value)
        }}
        ref={selectRef}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
