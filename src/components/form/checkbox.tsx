import { Checkbox, FormControl, FormErrorMessage, FormHelperText } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  children?;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  hidden?;
  onChangeCallback?;
}

export const CheckboxField = ({
  name,
  label,
  mb = 4,
  hint,
  disabled,
  onChangeCallback,
  children,
  ...props
}: ITextBoxProps) => {
  const {
    field: { onChange, onBlur, value },
    fieldState
  } = useController({ name });

  return (
    <FormControl isInvalid={!!fieldState.error} mb={mb} {...props}>
      <Checkbox
        name={name}
        onChange={(e) => {
          onChange(e.target["checked"]);
          onChangeCallback && onChangeCallback(e.target["checked"]);
        }}
        placeholder={label}
        onBlur={onBlur}
        defaultChecked={value}
        isDisabled={disabled}
      >
        {children || label}
      </Checkbox>

      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
