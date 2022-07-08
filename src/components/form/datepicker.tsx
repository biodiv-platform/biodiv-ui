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
import useDidUpdateEffect from "@hooks/use-did-update-effect";
import CalendarIcon from "@icons/calendar";
import { FORM_DATEPICKER_CHANGE } from "@static/events";
import { formatDate, parseDate } from "@utils/date";
import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useListener } from "react-gbus";
import { useController } from "react-hook-form";

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
  inputRef?;
}

const maxDate = new Date().setHours(23, 59, 59, 999); // End of Day

/**
 * @deprecated use `<DatePickerNextField/>` instead
 *
 */
export const DatePickerField = ({
  name,
  label,
  mb = 4,
  hint,
  disabled = true,
  subscribe = false,
  dateFormat = "d-m-Y",
  inputRef,
  ...props
}: IDatePickerBoxProps) => {
  const { field, fieldState } = useController({ name });
  const [date, setDate] = useState(field.value ? parseDate(field.value) : undefined);

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.onChange = setDate;
    }

    date && field.onChange(formatDate(date));
  }, []);

  useDidUpdateEffect(() => {
    field.onChange(formatDate(date));
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
          options={{ allowInput: true, maxDate, dateFormat }}
          onChange={setDate}
          render={({ defaultValue, value, ...props }, ref) => (
            <Input
              isReadOnly={disabled}
              id={name}
              {...props}
              disabled={disabled}
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
