import { Checkbox, CheckboxGroup, FormControl, FormLabel } from "@chakra-ui/core";
import ErrorMessage from "@components/form/common/error-message";
import React, { useEffect, useMemo } from "react";
import { UseFormMethods } from "react-hook-form";

interface ITextBoxProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  form: UseFormMethods<Record<string, any>>;
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
      <ErrorMessage name={name} errors={form.errors} />
    </FormControl>
  );
};

export default CheckboxGroupField;
