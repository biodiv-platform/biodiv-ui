import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import bbox from "@turf/bbox";
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
  const defaultViewState = React.useMemo(() => getMapCenter(2.8), []);

  const defaultFeatures = useMemo(() => typeof field.value === "string"?stringToFeature(field.value):field.value?[
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          field.value?.ne,
          [field.value?.ne[0], field.value?.se[1]],
          field.value?.se,
          [field.value?.se[0], field.value?.ne[1]],
          field.value?.ne
        ]
      }
    }
  ]:[], [field.value]);

  const handleOnFeatureChange = (features) => {
    if (!features.length) {
      setCoordinates({});
      return;
    }

    const [minlng, minlat, maxlng, maxlat] = bbox({ type: "FeatureCollection", features });
    setCoordinates({
      ne: [maxlng, minlat],
      se: [minlng, maxlat]
    });
  };

  useEffect(() => {
    field.onChange(coordinates);
  }, [coordinates]);

  useEffect(() => {
    handleOnFeatureChange(defaultFeatures);
  }, []);

  return (
    <FormControl isRequired={isRequired} isInvalid={!!fieldState.error} mb={mb} {...props}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Box position="relative" h="22rem" borderRadius="md" overflow="hidden">
        <NakshaMapboxDraw
          defaultViewState={defaultViewState}
          features={defaultFeatures}
          onFeaturesChange={handleOnFeatureChange}
          mapboxAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
        />
      </Box>
      <FormErrorMessage children={JSON.stringify(fieldState?.error?.message)} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
