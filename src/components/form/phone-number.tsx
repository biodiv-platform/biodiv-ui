import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import styled from "@emotion/styled";
import React from "react";
import { useController } from "react-hook-form";
import MobileInput from "react-phone-number-input";

const PhoneFormControl = styled.div`
  .PhoneInput {
    position: relative;
    input {
      padding-left: 3rem;
    }
    .PhoneInputCountryIconUnicode,
    .PhoneInputCountryIcon {
      line-height: 2.5rem;
      padding: 0 0.7rem;
      font-size: 1.4rem;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 2;
    }
    select {
      display: none;
    }
  }
`;

interface ISelectProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  defaultCountry?: string;
  onBlur?;
}

export const PhoneNumberInputField = ({
  name,
  label,
  hint,
  mb = 4,
  defaultCountry = SITE_CONFIG.MAP.COUNTRY,
  disabled = false,
  ...props
}: ISelectProps) => {
  const { field, fieldState } = useController({ name });

  return (
    <FormControl as={PhoneFormControl} isInvalid={fieldState.invalid} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <MobileInput
        id={name}
        inputComponent={Input}
        countrySelectProps={{ unicodeFlags: true }}
        defaultCountry={defaultCountry}
        disabled={disabled}
        {...field}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
