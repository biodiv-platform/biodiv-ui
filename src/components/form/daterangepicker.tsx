import "flatpickr/dist/themes/material_blue.css";

import {
  FormControl,
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

import ErrorMessage from "./common/error-message";

interface IDatePickerBoxProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  disableInput?:boolean;
  hint?: string;
  dateFormat?: string;
  style?;
  hasMaxDate?: boolean;
  isRequired?: boolean;
  subscribe?: boolean;
  form;
}

const DateRangePickerField = ({
  name,
  label,
  form,
  mb = 4,
  hint,
  disabled = true,
  disableInput=false,
  subscribe = false,
  hasMaxDate = true,
  dateFormat = "d-m-Y",
  ...props
}: IDatePickerBoxProps) => {
  const [date, setDate] = useState(parseDateRange(form.control.defaultValuesRef.current[name]));
  const maxDate = hasMaxDate ? new Date().setHours(23, 59, 59, 999) : null; // End of Day

  useEffect(() => {
    form.register({ name });
    form.setValue(name, formatDateRange(date));
  }, [form.register]);

  useEffect(() => {
    form.setValue(name, formatDateRange(date));
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
    <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
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
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default DateRangePickerField;
