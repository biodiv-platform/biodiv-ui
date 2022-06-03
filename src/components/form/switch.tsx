import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Switch
} from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  color?: string;
  hint?: string;
}

export const SwitchField = ({
  name,
  label,
  mb = 4,
  color = "blue",
  hint,
  disabled,
  ...props
}: ITextBoxProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <FormControl isInvalid={fieldState.invalid} mb={mb} {...props}>
      <Flex>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Switch
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e.target["checked"])}
          defaultChecked={field.value}
          isDisabled={disabled}
          color={color}
          name={name}
        />
      </Flex>
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
