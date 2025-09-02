import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import GeoJSONPreview from "@components/@core/map-preview/geojson";
import { getMapCenter } from "@utils/location";
import notification, { NotificationType } from "@utils/notification";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";
import { LuView } from "react-icons/lu";
import { parse, stringify } from "wkt";

import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

const NakshaMaplibreDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

interface IGeojsonWktInputProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isPolygon?: boolean;
}

export default function GeoJsonWktParserInput({
  name,
  label,
  hint,
  isRequired,
  isPolygon,
  isReadOnly,
  mb = 4,
  ...props
}: IGeojsonWktInputProps) {
  const { field, fieldState } = useController({ name });
  const wktInputRef: any = useRef<HTMLInputElement>(null);
  const [wkt, setWkt] = useState<string | null>();
  const { t } = useTranslation();
  const [canShow, setShow] = useState<boolean>(false);
  const [featureData, setDefaultFeatureData] = useState();
  const defaultViewState = React.useMemo(() => getMapCenter(2), []);

  const handleMapDraw = (geoJson) => {
    if (geoJson.length > 0) {
      setWkt(stringify(geoJson[0]));
    }
  };

  const handleWktInput = () => {
    const geoJson = parse(wktInputRef.current.value);
    if (geoJson) {
      setDefaultFeatureData(parse(wktInputRef.current.value));
      field.onChange(wktInputRef.current.value);
    } else {
      field.onChange(null);
      notification(t("group:invalid_wkt"), NotificationType.Error);
    }
  };

  const toggleWktInput = () => {
    setWkt(null);
    setShow(!canShow);
  };

  useEffect(() => {
    field.onChange(wkt);
  }, [wkt]);

  return (
    <>
      <Field
        invalid={!!fieldState.error}
        data-select-invalid={!!fieldState.error}
        mb={mb}
        {...props}
      />
      <Flex justifyContent="flex-end">
        <Checkbox onChange={toggleWktInput}>{t("form:wkt")}</Checkbox>
      </Flex>
      {label && <Field htmlFor={name}>{label}</Field>}
      <Box position="relative" h="22rem" borderRadius="md" mb={3} overflow="hidden">
        {canShow ? (
          <GeoJSONPreview data={featureData} />
        ) : (
          <NakshaMaplibreDraw
            defaultViewState={defaultViewState}
            // mapboxAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
            onFeaturesChange={handleMapDraw}
          />
        )}
      </Box>
      {canShow && (
        <InputGroup
          // size="md"
          startElement={
            <IconButton aria-label="verify-wkt" colorPalette="blue" onClick={handleWktInput}>
              <LuView />
            </IconButton>
          }
        >
          <Input type="text" ref={wktInputRef} name="wktInput" placeholder="Enter Valid WKT" />
        </InputGroup>
      )}
      <Field errorText={fieldState?.error?.message} />
      {hint && <Field color="gray.600" helperText={hint} />}
    </>
  );
}
