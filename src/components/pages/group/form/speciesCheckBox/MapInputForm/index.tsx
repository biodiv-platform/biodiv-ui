import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/core";
import useObservationFilter from "@hooks/useObservationFilter";
import { MAP_CENTER } from "@static/constants";
import { stringToFeature } from "@utils/location";
import { MapAreaDraw } from "naksha-components-react";
import React, { useMemo, useEffect, useState } from "react";

const defaultViewPort = {
  latitude: MAP_CENTER.lat,
  longitude: MAP_CENTER.lng,
  zoom: 2.8,
  bearing: 0,
  pitch: 0
};

export default function MapInputForm({ form, label, name, hint = null, mb = 4, ...props }) {
  const { filter } = useObservationFilter();
  const { register, setValue } = form;
  const defaultFeatures = useMemo(
    () => stringToFeature(form?.control?.defaultValuesRef?.current[name] || filter?.location),
    []
  );
  const [coordinates, setCoordinated] = useState({});
  const handleOnFeatureChange = (features) => {
    if (features.length > 0) {
      setCoordinated({
        ne: features[0].geometry.coordinates[0][0],
        se: features[0].geometry.coordinates[0][2]
      });
    } else {
      setCoordinated({});
    }
  };

  useEffect(() => {
    setValue(name, coordinates);
  }, [coordinates]);

  useEffect(() => {
    register({ name });
    handleOnFeatureChange(defaultFeatures);
  }, [register]);

  return (
    <FormControl isRequired={true} isInvalid={form.errors[name] && true} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Box position="relative" h="22rem">
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
