import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading
} from "@chakra-ui/core";
import { capitalizeFirstLetter } from "@utils/text";
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
    <FormControl m={5} isInvalid={form.errors[name] && true} mb={mb} {...props}>
      <Heading as="h3" pb={4} pt={4} size="lg">
        {capitalizeFirstLetter(label)}
      </Heading>
      <CheckboxGroup
        defaultValue={isReadOnly ? list.map((item) => item.name) : defaultValue}
        onChange={handeClick}
        display="grid"
        className="custom-checkbox-group"
        gridGap={8}
        gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
      >
        {list.map((item, index) => (
          <Checkbox isDisabled={isReadOnly} key={index} value={item.value || item.name}>
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
