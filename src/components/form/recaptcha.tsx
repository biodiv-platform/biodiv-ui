import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/core";
import React, { useEffect, useState } from "react";
import ReCaptcha from "react-google-recaptcha";
import { FormContextValues } from "react-hook-form";

interface IRecaptchaProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  form: FormContextValues<any>;
}

const RecaptchaField = ({ name, label, hint, form, mb = 4, ...props }: IRecaptchaProps) => {
  const [value, setValue] = useState(form.control.defaultValuesRef.current[name]);

  useEffect(() => {
    form.setValue(name, value);
  }, [value]);

  useEffect(() => {
    form.register({ name });
  }, [form.register]);

  return (
    <FormControl isInvalid={form.errors[name] && true} mb={mb} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <ReCaptcha
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        onExpired={setValue}
        onChange={setValue}
      />
      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default RecaptchaField;
