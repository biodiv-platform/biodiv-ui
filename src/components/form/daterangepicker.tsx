import "flatpickr/dist/themes/material_blue.css";

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
import { FORM_DATEPICKER_CHANGE } from "@static/events";
import { formatDateRange, parseDateRange } from "@utils/date";
import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useListener } from "react-gbus";
import { useController } from "react-hook-form";

interface IDatePickerBoxProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  disableInput?: boolean;
  hint?: string;
  dateFormat?: string;
  style?;
  hasMaxDate?: boolean;
  isRequired?: boolean;
  subscribe?: boolean;
}

export const DateRangePickerField = ({
  name,
  label,
  mb = 4,
  hint,
  disabled = true,
  disableInput = false,
  subscribe = false,
  hasMaxDate = true,
  dateFormat = "d-m-Y",
  ...props
}: IDatePickerBoxProps) => {
  const { field, fieldState } = useController({ name });
  const [date, setDate] = useState(parseDateRange(field.value));
  const maxDate = hasMaxDate ? new Date().setHours(23, 59, 59, 999) : null; // End of Day

  useEffect(() => {
    field.onChange(formatDateRange(date));
  }, [date]);

  if (subscribe) {
    useListener(
      (d) => {
        d && setDate(d);
      },
      [`${FORM_DATEPICKER_CHANGE}${name}`]
    );
  }

  return (
    <FormControl isInvalid={!!fieldState.error} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <InputGroup>
        <Flatpickr
          value={date}
          options={{ allowInput: true, maxDate, dateFormat, mode: "range" }}
          onChange={setDate}
          render={({ defaultValue, value, ...props }, ref) => (
            <Input
              disabled={disableInput}
              isReadOnly={disabled}
              id={name}
              {...props}
              placeholder={label}
              defaultValue={defaultValue}
              ref={ref}
            />
          )}
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
  );
};
