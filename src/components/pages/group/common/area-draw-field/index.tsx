import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/core";
import { MAP_CENTER } from "@static/constants";
import { stringToFeature } from "@utils/location";
import { MapAreaDraw } from "naksha-components-react";
import React, { useEffect, useMemo, useState } from "react";

const defaultViewPort = {
  latitude: MAP_CENTER.lat,
  longitude: MAP_CENTER.lng,
  zoom: 2.8,
  bearing: 0,
  pitch: 0
};

interface AreaDrawFieldProps {
  form;
  label: string;
  name: string;
  hint?: string;
  mb?: number;
  isRequired?: boolean;
  [key: string]: any;
}

export default function AreaDrawField({
  form,
  label,
  name,
  hint,
  mb = 4,
  isRequired,
  ...props
}: AreaDrawFieldProps) {
  const { register, setValue } = form;
  const [coordinates, setCoordinates] = useState({});

  const defaultFeatures = useMemo(
    () => stringToFeature(form?.control?.defaultValuesRef?.current[name]),
    []
  );

  const handleOnFeatureChange = (features) => {
    setCoordinates(
      features.length
        ? {
            ne: features[0].geometry.coordinates[0][0],
            se: features[0].geometry.coordinates[0][2]
          }
        : {}
    );
  };

  useEffect(() => {
    setValue(name, coordinates);
  }, [coordinates]);

  useEffect(() => {
    register({ name });
    handleOnFeatureChange(defaultFeatures);
  }, [register]);

  return (
    <FormControl isRequired={isRequired} isInvalid={form.errors[name] && true} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Box position="relative" h="22rem" borderRadius="md" overflow="hidden">
        <MapAreaDraw
          defaultViewPort={defaultViewPort}
          defaultFeatures={defaultFeatures}
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          onFeaturesChange={handleOnFeatureChange}
          isPolygon={false}
        />
      </Box>
      <FormErrorMessage>{form.errors[name] && form.errors[name]["se"]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
