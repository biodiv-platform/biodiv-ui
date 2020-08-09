import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/core";
import SITE_CONFIG from "@configs/site-config.json";
import { stringToFeature } from "@utils/location";
import { MapAreaDraw } from "naksha-components-react";
import React, { useEffect, useMemo, useState } from "react";

const defaultViewPort = {
  ...SITE_CONFIG.MAP.CENTER,
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
  isPolygon?: boolean;
  handleChage?;
  isReadOnly?: boolean;
  [key: string]: any;
}

export default function AreaDrawField({
  form,
  label,
  name,
  hint,
  mb = 4,
  isRequired,
  isReadOnly,
  handleChage,
  isPolygon,
  ...props
}: AreaDrawFieldProps) {
  const { register, setValue } = form;
  const [coordinates, setCoordinates] = useState({});

  const defaultFeatures = useMemo(
    () => stringToFeature(form?.control?.defaultValuesRef?.current[name]),
    []
  );

  const handleOnFeatureChange = (features) => {
    if (handleChage) {
      handleChage(features);
    }
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
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          onFeaturesChange={handleOnFeatureChange}
          isPolygon={isPolygon}
          isReadOnly={isReadOnly}
        />
      </Box>
      <FormErrorMessage>{form.errors[name] && form.errors[name]["se"]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
