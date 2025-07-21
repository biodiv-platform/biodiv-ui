import { Box } from "@chakra-ui/react";
import { MENU_PORTAL_TARGET } from "@static/constants";
import React from "react";
import { useController } from "react-hook-form";
import Select, { components } from "react-select";

import { Field } from "../ui/field";
import { ClearIndicator, reactSelectProps } from "./configs";

interface SelectInputFieldProps {
  name: string;
  label?: string;
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
  placeholder?;
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
  placeholder,
  ...props
}: SelectInputFieldProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <Field
      invalid={!!fieldState.error}
      className="dropdown"
      aria-invalid={!!fieldState.error}
      mb={mb}
      hidden={hidden}
      required={isRequired}
      htmlFor={name}
      label={label}
      errorText={fieldState?.error?.message}
      {...props}
    >
      <Box width={"full"}>
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
            ClearIndicator,
            IndicatorSeparator: () => null
          }}
          placeholder={placeholder}
          menuPortalTarget={shouldPortal ? MENU_PORTAL_TARGET : undefined}
          isSearchable={true}
          isDisabled={disabled}
          {...{
            [isControlled ? "value" : "defaultValue"]: options.find((o) => o.value === field.value)
          }}
          ref={selectRef}
          {...reactSelectProps}
        />
      </Box>

      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
};
