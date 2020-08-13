import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/core";
import SITE_CONFIG from "@configs/site-config.json";
import React, { useEffect, useState } from "react";
import ReCaptcha from "react-google-recaptcha";
import { UseFormMethods } from "react-hook-form";

import ErrorMessage from "./common/error-message";

interface IRecaptchaProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  form: UseFormMethods<Record<string, any>>;
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
      <ReCaptcha sitekey={SITE_CONFIG.TOKENS.RECAPTCHA} onExpired={setValue} onChange={setValue} />
      <ErrorMessage name={name} errors={form.errors} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};

export default RecaptchaField;
