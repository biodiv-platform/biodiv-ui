import { Box } from "@chakra-ui/react";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { useController } from "react-hook-form";
import { parse, stringify } from "wkt";

import { Field } from "@/components/ui/field";
import { mapStyles } from "@/static/constants";
const NakshaMaplibreDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreDraw),
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
  const [, setCurrentFeatures] = useState([]);
  const defaultViewState = React.useMemo(() => getMapCenter(2.8), []);

  const defaultFeatures = useMemo(() => {
    if (!field.value || typeof field.value !== "string" || field.value.trim() === "") {
      return [];
    }
    const geometry = parse(field.value); // Convert WKT to GeoJSON geometry
    return [
      {
        type: "Feature",
        properties: {},
        geometry
      }
    ];
  }, []);

  const handleOnFeatureChange = (features) => {
    setCurrentFeatures(features);
    if (!features.length) {
      field.onChange("");
      return;
    }

    const wktString = stringify(features[0].geometry); // Convert to WKT
    field.onChange(wktString);
  };

  useEffect(() => {
    // Trigger initial onChange in case there's a default value (WKT)
    if (defaultFeatures.length) {
      handleOnFeatureChange(defaultFeatures);
    }
  }, []);

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
      <NakshaMaplibreDraw
        defaultViewState={defaultViewState}
        features={defaultFeatures}
        onFeaturesChange={handleOnFeatureChange}
        mapStyles={mapStyles}
      />
    </Box>
  );
}
