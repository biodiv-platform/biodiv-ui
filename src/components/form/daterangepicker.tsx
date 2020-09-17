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
  hint?: string;
  dateFormat?: string;
  style?;
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
  subscribe = false,
  dateFormat = "d-m-Y",
  ...props
}: IDatePickerBoxProps) => {
  const [date, setDate] = useState(parseDateRange(form.control.defaultValuesRef.current[name]));
  const maxDate = new Date().setHours(23, 59, 59, 999); // End of Day

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
            <Icon name="calendar" color="gray.300" />
          </label>
        </InputRightElement>
      </InputGroup>
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default DateRangePickerField;
