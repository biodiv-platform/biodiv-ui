import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/core";
import { getByPath } from "@utils/basic";
import React, { useEffect, useState } from "react";
import { FormContextValues } from "react-hook-form";

interface TextBoxControlledFieldProps {
  id?: string;
  name: string;
  label: string;
  type?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  form: FormContextValues<any>;
  style?;
  isRequired?: boolean;
  showLabel?: boolean;
  hidden?;
}

const TextBoxControlledField = ({
  id,
  name,
  label,
  type = "text",
  form,
  mb = 4,
  disabled,
  hint,
  isRequired,
  showLabel = true,
  hidden,
  ...props
}: TextBoxControlledFieldProps) => {
  const [value, setValue] = useState(form.control.defaultValuesRef.current[name]);

  useEffect(() => {
    form.setValue(name, value);
  }, [value]);

  useEffect(() => {
    form.register({ name });
    setValue(getByPath(form?.control?.defaultValuesRef?.current, name));
  }, [form.register]);

  return (
    <FormControl
      isInvalid={form.errors[name] && true}
      mb={mb}
      hidden={hidden}
      isRequired={isRequired}
      {...props}
    >
      {showLabel && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Input
        name={name}
        id={id || name}
        placeholder={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        isDisabled={disabled}
      />
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default TextBoxControlledField;
