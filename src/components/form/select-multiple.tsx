import { Box } from "@chakra-ui/react";
import { MENU_PORTAL_TARGET } from "@static/constants";
import React from "react";
import { useController } from "react-hook-form";
import Select, { components } from "react-select";

import { Field } from "../ui/field";
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
  shouldPortal?: boolean;
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
  shouldPortal,
  ...props
}: SelectMultipleProps) => {
  const { field, fieldState } = useController({ name });
  const initialValue = options.filter((v) => (field.value || []).includes(v.value));

  return (
    <Field
      invalid={!!fieldState.error}
      className="dropdown"
      aria-invalid={!!fieldState.error}
      mb={mb}
      htmlFor={name}
      label={label}
      required={isRequired}
      errorText={fieldState?.error?.message}
      {...props}
    >
      <Box width={"full"}>
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
          menuPortalTarget={shouldPortal ? MENU_PORTAL_TARGET : undefined}
        />
      </Box>
      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
};
