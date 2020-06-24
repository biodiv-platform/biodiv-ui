import { Checkbox, CheckboxGroup, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/core";
import React, { useEffect, useMemo } from "react";
import { FormContextValues } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  form: FormContextValues<any>;
  mb?: number;
  disabled?: boolean;
}

const CheckboxGroupField = ({
  name,
  label,
  options,
  form,
  mb = 4,
  disabled,
  ...props
}: ITextBoxProps) => {
  const initialValue = useMemo(() => form.control.defaultValuesRef.current[name] || [], []);

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  const handleOnChange = (item) => {
    form.setValue(name, item);
  };

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
      <FormLabel htmlFor="email">{label}</FormLabel>
      <CheckboxGroup
        defaultValue={initialValue}
        onChange={handleOnChange}
        className="custom-checkbox-group"
        isInline={true}
      >
        {options.map((item) => (
          <Checkbox w="22rem" isDisabled={disabled} key={item.value} value={item.value}>
            {item.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
    </FormControl>
  );
};

export default CheckboxGroupField;
