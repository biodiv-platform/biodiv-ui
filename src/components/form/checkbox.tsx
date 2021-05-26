import { Checkbox, FormControl, FormErrorMessage, FormHelperText } from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  hint?: string;
}

export const CheckboxField = ({ name, label, mb = 4, hint, disabled, ...props }: ITextBoxProps) => {
  const {
    field: { onChange, onBlur, value },
    fieldState
  } = useController({ name });

  return (
    <FormControl isInvalid={fieldState.invalid} mb={mb} {...props}>
      <Checkbox
        name={name}
        onChange={(e) => onChange(e.target["checked"])}
        placeholder={label}
        onBlur={onBlur}
        defaultIsChecked={value}
        isDisabled={disabled}
      >
        {label}
      </Checkbox>

      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
