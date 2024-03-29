import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { AUTOCOMPLETE_FIELDS, GEOCODE_OPTIONS } from "@static/location";
import React from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { useController, useFormContext } from "react-hook-form";

interface ILocationInputProps {
  name: string;
  label?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  maxLength?;
  style?;
  isRequired?;
  placeholder?;
  latName?;
  lngName?;
}

export const LocationInputField = ({
  name,
  label,
  mb = 4,
  disabled,
  hint,
  placeholder,
  latName,
  lngName,
  ...props
}: ILocationInputProps) => {
  const { field, fieldState } = useController({ name });
  const form = useFormContext();

  const { ref }: any = usePlacesWidget({
    apiKey: SITE_CONFIG.TOKENS.GMAP,
    onPlaceSelected: (place) => {
      if (latName) form.setValue(latName, place.geometry?.location?.lat());
      if (lngName) form.setValue(lngName, place.geometry?.location?.lng());
      field.onChange(place.formatted_address);
    },
    options: { ...GEOCODE_OPTIONS, fields: AUTOCOMPLETE_FIELDS, types: "regions" }
  });

  return (
    <FormControl isInvalid={!!fieldState.error} mb={mb} {...props}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Input
        defaultValue={field.value}
        id={name}
        isDisabled={disabled}
        name={name}
        placeholder={placeholder}
        ref={ref}
      />
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
