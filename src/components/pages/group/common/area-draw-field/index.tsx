import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { useController } from "react-hook-form";
import { parse } from "wkt";

import { Field } from "@/components/ui/field";

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
  //const [coordinates, setCoordinates] = useState({});
  const defaultViewState = React.useMemo(() => getMapCenter(2.8), []);

  const defaultFeatures = useMemo(() => parse(field.value), []);

  /*const handleOnFeatureChange = (features) => {
    if (!features.length) {
      setCoordinates({});
      return;
    }

    const [minlng, minlat, maxlng, maxlat] = bbox({
      type: "FeatureCollection",
      features
    });

    setCoordinates({
      ne: [maxlng, minlat],
      se: [minlng, maxlat]
    });
  };*/

  /*useEffect(() => {
    field.onChange(coordinates);
  }, [coordinates]);*/

  /*useEffect(() => {
    handleOnFeatureChange(defaultFeatures);
  }, []);*/

  return (
    <Box position="relative" h="22rem" borderRadius="md" overflow="hidden">
      <Field
        required={isRequired}
        invalid={!!fieldState.error}
        mb={mb}
        {...props}
        htmlFor={name}
        label={label}
        errorText={JSON.stringify(fieldState?.error?.message)}
      />
      {hint && <Field color="gray.600" helperText={hint} />}
      <NakshaMapboxDraw
        defaultViewState={defaultViewState}
        features={defaultFeatures}
        //onFeaturesChange={handleOnFeatureChange}
        mapboxAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
      />
    </Box>
  );
}
