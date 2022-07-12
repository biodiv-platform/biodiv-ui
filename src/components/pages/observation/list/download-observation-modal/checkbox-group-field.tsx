import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack
} from "@chakra-ui/react";
import React from "react";
import { useController } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  mb?: number;
  disabled?: boolean;
}

const CheckboxGroupField = ({
  name,
  label,
  options,
  mb = 4,
  disabled,
  ...props
}: ITextBoxProps) => {
  const { field, fieldState } = useController({ name, defaultValue: [] });

  return (
    <FormControl isInvalid={!!fieldState.error} mb={mb} {...props}>
      <FormLabel htmlFor="email">{label}</FormLabel>
      <CheckboxGroup defaultValue={field.value} onChange={field.onChange}>
        <Stack className="custom-checkbox-group">
          {options.map((item) => (
            <Checkbox w="22rem" isDisabled={disabled} key={item.value} value={item.value}>
              {item.label}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
      <FormErrorMessage children={fieldState?.error?.message} />
    </FormControl>
  );
};

export default CheckboxGroupField;
