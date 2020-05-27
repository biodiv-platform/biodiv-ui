import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/core";
import { FORM_DATEPICKER_CHANGE } from "@static/events";
import { formatDate, parseDate } from "@utils/date";
import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useListener } from "react-gbus";

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
  const [date, setDate] = useState(parseDate(form.control.defaultValuesRef.current[name]));
  const maxDate = new Date().setHours(23, 59, 59, 999); // End of Day

  useEffect(() => {
    form.register({ name });
    form.setValue(name, formatDate(date));
  }, [form.register]);

  useEffect(() => {
    form.setValue(name, formatDate(date));
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
          options={{ allowInput: true, maxDate, dateFormat }}
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
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default DatePickerField;
