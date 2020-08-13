import {
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/core";
import { FORM_DATEPICKER_CHANGE } from "@static/events";
import React from "react";
import Flatpickr from "react-flatpickr";
import { useListener } from "react-gbus";
import { Controller, UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface IDatePickerBoxProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  dateFormat?: string;
  style?;
  isRequired?: boolean;
  subscribe?: boolean;
  form: UseFormMethods<Record<string, any>>;
}

const DatePickerField = ({
  name,
  label,
  form,
  mb = 4,
  hint,
  disabled = true,
  subscribe = false,
  dateFormat = "d-m-Y",
  ...props
}: IDatePickerBoxProps) => {
  const maxDate = new Date().setHours(23, 59, 59, 999); // End of Day

  if (subscribe) {
    useListener(
      (d) => {
        d && form.setValue(name, d, { shouldDirty: true, shouldValidate: true });
      },
      [`${FORM_DATEPICKER_CHANGE}${name}`]
    );
  }

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <InputGroup>
        <Controller
          control={form.control}
          name={name}
          defaultValue={new Date()}
          render={({ onChange, onBlur, value }) => (
            <Flatpickr
              value={value}
              options={{ allowInput: true, maxDate, dateFormat }}
              onChange={([v]) => onChange(v)}
              render={({ defaultValue, value, ...props }, ref) => (
                <Input
                  isReadOnly={disabled}
                  id={name}
                  onBlur={onBlur}
                  {...props}
                  placeholder={label}
                  defaultValue={defaultValue}
                  ref={ref}
                />
              )}
            />
          )}
        />

        <InputRightElement>
          <label htmlFor={name} style={{ cursor: "pointer" }}>
            <Icon name="calendar" color="gray.300" />
          </label>
        </InputRightElement>
      </InputGroup>
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default DatePickerField;
