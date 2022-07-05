import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea
} from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

interface ITextAreaProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  maxLength?;
  style?;
  isRequired?;
}

export const TextAreaField = ({
  name,
  label,
  mb = 4,
  disabled,
  maxLength,
  hint,
  ...props
}: ITextAreaProps) => {
  const { field, fieldState } = useController({ name, defaultValue: "" });

  return (
    <FormControl isInvalid={fieldState.invalid} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea
        id={name}
        placeholder={label}
        minH="124px"
        isDisabled={disabled}
        bg="white"
        maxLength={maxLength}
        {...field}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
      {maxLength && field.value && (
        <FormHelperText color="gray.600" children={`${field.value.length}/${maxLength}`} />
      )}
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
