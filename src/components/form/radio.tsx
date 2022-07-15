import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack
} from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

interface IRadioProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  options?: any[];
  isInline?: boolean;
}

export const RadioInputField = ({
  name,
  label,
  hint,
  mb = 4,
  isInline = true,
  options = [],
  ...props
}: IRadioProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <FormControl isInvalid={!!fieldState.error} mb={mb} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup key={name} {...field}>
        <Stack direction={isInline ? "row" : "column"} py={2}>
          {options.map((o) => (
            <Radio key={o.value} id={o.value} value={o.value}>
              {o.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
