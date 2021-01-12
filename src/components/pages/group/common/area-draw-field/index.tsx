import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import { getMapCenter, stringToFeature } from "@utils/location";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";

const NakshaMapboxDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

interface AreaDrawFieldProps {
  form;
  label: string;
  name: string;
  hint?: string;
  mb?: number;
  isRequired?: boolean;
  isControlled?: boolean;
  [key: string]: any;
}

export default function AreaDrawField({
  form,
  label,
  name,
  hint,
  mb = 4,
  isRequired,
  isControlled,
  ...props
}: AreaDrawFieldProps) {
  const { register, setValue } = form;
  const [coordinates, setCoordinates] = useState({});
  const defaultViewPort = React.useMemo(() => getMapCenter(2.8), []);

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
        <NakshaMapboxDraw
          defaultViewPort={defaultViewPort}
          defaultFeatures={defaultFeatures}
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          onFeaturesChange={handleOnFeatureChange}
          isPolygon={false}
        />
      </Box>
      <FormErrorMessage>{form.errors[name] && form.errors[name]["se"]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
