import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import React from "react";
import ReCaptcha from "react-google-recaptcha";
import { useController } from "react-hook-form";

interface IRecaptchaProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
}

export const RecaptchaField = ({ name, label, hint, mb = 4, ...props }: IRecaptchaProps) => {
  const { field, fieldState } = useController({ name, defaultValue: null });

  return (
    <FormControl isInvalid={!!fieldState.error} mb={mb} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <ReCaptcha
        sitekey={SITE_CONFIG.TOKENS.RECAPTCHA}
        onExpired={field.onChange}
        onChange={field.onChange}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
