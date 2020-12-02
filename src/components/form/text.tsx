import { FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import React from "react";
import { UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";
import { getByPath } from "@utils/basic";

interface ITextBoxProps {
  id?: string;
  name: string;
  label: string;
  type?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  form: UseFormMethods<Record<string, any>>;
  style?;
  isRequired?: boolean;
  showLabel?: boolean;
  hidden?;
  autoComplete?;
}

const TextBoxField = ({
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
  autoComplete,
  ...props
}: ITextBoxProps) => (
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
      ref={form.register}
      type={type}
      isDisabled={disabled}
      defaultValue={getByPath(form.control.defaultValuesRef.current, name)}
      autoComplete={autoComplete}
    />
    <ErrorMessage name={name} errors={form.errors} />
    {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
  </FormControl>
);

export default TextBoxField;
