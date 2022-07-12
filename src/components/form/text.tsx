import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

interface ITextBoxProps {
  id?: string;
  name: string;
  label: string;
  type?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  style?;
  maxLength?;
  isRequired?: boolean;
  showLabel?: boolean;
  hidden?;
  autoComplete?;
}

export const TextBoxField = ({
  id,
  name,
  label,
  type = "text",
  mb = 4,
  disabled,
  hint,
  isRequired,
  showLabel = true,
  maxLength,
  hidden,
  autoComplete,
  ...props
}: ITextBoxProps) => {
  const { field, fieldState } = useController({
    name,
    defaultValue: "" // to prevent uncontrolled to controlled error
  });

  return (
    <FormControl
      isInvalid={!!fieldState.error}
      mb={mb}
      hidden={hidden}
      isRequired={isRequired}
      {...props}
    >
      {showLabel && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Input
        id={id || name}
        placeholder={label}
        type={type}
        maxLength={maxLength}
        isDisabled={disabled}
        autoComplete={autoComplete}
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
