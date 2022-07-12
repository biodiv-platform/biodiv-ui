import "react-datepicker/dist/react-datepicker.css";

import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import CalendarIcon from "@icons/calendar";
import React from "react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

interface DatePickerNextFieldProps {
  disabled?: boolean;
  hint?: string;
  isRequired?: boolean;
  label?: string;
  mb?: number;
  name: string;
  placeholder?;
  style?;
}

const maxDate = new Date().setHours(23, 59, 59, 999); // End of Day

export const DatePickerNextField = ({
  disabled,
  hint,
  label,
  mb = 4,
  name,
  placeholder,
  ...props
}: DatePickerNextFieldProps) => (
  <Controller
    name={name}
    render={({ field, fieldState }) => (
      <FormControl isInvalid={!!fieldState.error} mb={mb} {...props}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <InputGroup>
          <DatePicker
            customInput={<Input />}
            dateFormat="dd-MM-yyyy"
            isReadOnly={disabled}
            placeholderText={placeholder || label}
            onChange={field.onChange}
            selected={field.value ? new Date(field.value) : undefined}
            maxDate={maxDate}
            portalId={name}
          />
          <InputRightElement>
            <label htmlFor={name} style={{ cursor: "pointer" }}>
              <CalendarIcon color="gray.300" />
            </label>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage children={fieldState?.error?.message} />
        {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
      </FormControl>
    )}
  />
);
