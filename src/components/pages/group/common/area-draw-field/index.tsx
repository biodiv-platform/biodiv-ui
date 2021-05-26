import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import { getMapCenter, stringToFeature } from "@utils/location";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { useController } from "react-hook-form";

const NakshaMapboxDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

interface AreaDrawFieldProps {
  label: string;
  name: string;
  hint?: string;
  mb?: number;
  isRequired?: boolean;
  isControlled?: boolean;
  [key: string]: any;
}

export default function AreaDrawField({
  label,
  name,
  hint,
  mb = 4,
  isRequired,
  isControlled,
  ...props
}: AreaDrawFieldProps) {
  const { field, fieldState } = useController({ name });
  const [coordinates, setCoordinates] = useState({});
  const defaultViewPort = React.useMemo(() => getMapCenter(2.8), []);

  const defaultFeatures = useMemo(() => stringToFeature(field.value), []);

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
    field.onChange(coordinates);
  }, [coordinates]);

  useEffect(() => {
    handleOnFeatureChange(defaultFeatures);
  }, []);

  return (
    <FormControl isRequired={isRequired} isInvalid={fieldState.invalid} mb={mb} {...props}>
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
      <FormErrorMessage children={JSON.stringify(fieldState?.error?.message)} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
