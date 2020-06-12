import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  CheckboxGroup
} from "@chakra-ui/core";
import React, { useEffect } from "react";
import { FormContextValues } from "react-hook-form";

interface Options {
  name: string;
  value?: string;
}
interface ITextBoxProps {
  name: string;
  label: string;
  mt?: number;
  mb?: number;
  disabled?: boolean;
  list: Options[];
  defaultValue?: any[];
  hint?: string;
  isReadOnly?: boolean;
  form: FormContextValues<any>;
}

const CheckboxField = ({
  name,
  label,
  form,
  mb = 4,
  list,
  defaultValue = [],
  isReadOnly = false,
  hint,
  ...props
}: ITextBoxProps) => {
  const handeClick = (item) => {
    form.setValue(label, item);
  };

  useEffect(() => {
    form.register({ name: label });
  }, [form.register]);

  return (
    <FormControl m={[5]} isInvalid={form.errors[name] && true} mb={mb} {...props}>
      <Heading as="h3" pb={[4]} pt={[4]} size="lg">
        {`${label.substring(0, 1).toUpperCase()}${label.substring(1, label.length)}`}
      </Heading>
      <CheckboxGroup
        defaultValue={isReadOnly ? list.map((item) => item.name) : defaultValue}
        onChange={(v) => handeClick(v)}
        display="grid"
        className="custom-checkbox-group"
        gridGap={8}
        gridTemplateColumns={["repeat(1, 1.3fr)", "repeat(2, 1.3fr)"]}
      >
        {list.map((item, index) => (
          <Checkbox
            isDisabled={isReadOnly ? true : false}
            key={index}
            value={item.value || item.name}
          >
            {item.name}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default CheckboxField;
