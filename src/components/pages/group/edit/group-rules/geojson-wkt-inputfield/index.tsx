import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import GeoJSONPreview from "@components/@core/map-preview/geojson";
import SITE_CONFIG from "@configs/site-config";
import { getMapCenter } from "@utils/location";
import notification, { NotificationType } from "@utils/notification";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";
import { parse, stringify } from "wkt";

const NakshaMapboxDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxDraw),
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
  const defaultViewPort = React.useMemo(() => getMapCenter(2), []);

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
      notification(t("enter valid wkt string"), NotificationType.Error);
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
    <FormControl
      isInvalid={fieldState.invalid}
      data-select-invalid={fieldState.invalid}
      mb={mb}
      {...props}
    >
      <Flex justifyContent="flex-end">
        <Checkbox onChange={toggleWktInput}>{t("form:wkt")}</Checkbox>
      </Flex>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Box position="relative" h="22rem" borderRadius="md" mb={3} overflow="hidden">
        {canShow ? (
          <GeoJSONPreview data={featureData} />
        ) : (
          <NakshaMapboxDraw
            defaultViewPort={defaultViewPort}
            mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
            onFeaturesChange={handleMapDraw}
            isControlled={true}
            isPolygon={isPolygon}
          />
        )}
      </Box>
      {canShow && (
        <InputGroup size="md">
          <Input type="text" ref={wktInputRef} name="wktInput" placeholder="Enter Valid WKT" />
          <InputRightElement>
            <IconButton
              aria-label="verify-wkt"
              colorScheme="blue"
              onClick={handleWktInput}
              icon={<ViewIcon />}
            />
          </InputRightElement>
        </InputGroup>
      )}
      <FormErrorMessage children={fieldState?.error?.message} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
