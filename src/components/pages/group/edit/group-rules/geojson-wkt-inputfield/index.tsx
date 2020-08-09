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
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import SITE_CONFIG from "@configs/site-config.json";
import { stringToFeature } from "@utils/location";
import notification, { NotificationType } from "@utils/notification";
import { MapAreaDraw } from "naksha-components-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormContextValues } from "react-hook-form";
import Wicket from "wicket";

const defaultViewPort = {
  ...SITE_CONFIG.MAP.CENTER,
  zoom: 2,
  bearing: 0,
  pitch: 0
};

interface IGeojsonWktInputProps {
  name: string;
  label?: string;
  mb?: number;
  hint?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isPolygon?: boolean;
  form: FormContextValues<any>;
}

export default function GeoJsonWktParserInput({
  name,
  label,
  hint,
  form,
  isRequired,
  isPolygon,
  isReadOnly,
  mb = 4,
  ...props
}: IGeojsonWktInputProps) {
  const wktInputRef = useRef<HTMLInputElement>(null);
  const [wkt, setWkt] = useState<string>();
  const { t } = useTranslation();
  const [canShow, setShow] = useState<boolean>();
  const [defaultFeature, setDefaultFeature] = useState(
    useMemo(() => stringToFeature(form?.control?.defaultValuesRef?.current[name]), [])
  );

  const { register, setValue } = form;

  const handleMapDraw = (geoJson) => {
    const Wktdata = new Wicket.Wkt();
    if (geoJson.length > 0) {
      Wktdata.read(JSON.stringify(geoJson[0]));
      setWkt(Wktdata.write());
    }
  };

  const handleWktInput = () => {
    const Wktdata = new Wicket.Wkt();
    try {
      Wktdata.read(wktInputRef.current.value);
      setDefaultFeature(stringToFeature(`${Wktdata.toJson().coordinates}`));
      setValue(name, Wktdata.write());
    } catch (e) {
      setValue(name, null);
      notification(t("Enter Valid WKT string"), NotificationType.Error);
    }
  };

  const toggleWktInput = () => {
    setDefaultFeature([]);
    setWkt(null);
    setShow(!canShow);
  };

  useEffect(() => {
    register({ name });
    setValue(name, wkt);
  }, [register, wkt]);

  return (
    <FormControl
      isInvalid={form.errors[name] && true}
      data-select-invalid={form.errors[name] && true}
      mb={mb}
      {...props}
    >
      <Flex justifyContent="flex-end">
        <Checkbox onChange={toggleWktInput}>{t("Use WKT Input field")}</Checkbox>
      </Flex>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Box position="relative" h="22rem" borderRadius="md" mb={3} overflow="hidden">
        <MapAreaDraw
          defaultViewPort={defaultViewPort}
          defaultFeatures={defaultFeature}
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          onFeaturesChange={handleMapDraw}
          isControlled={true}
          isPolygon={isPolygon}
          isReadOnly={canShow}
        />
      </Box>
      {canShow && (
        <InputGroup size="md">
          <Input type="text" ref={wktInputRef} name="wktInput" placeholder="Enter Valid WKT" />
          <InputRightElement>
            <IconButton
              aria-label="verify-wkt"
              variantColor="blue"
              onClick={handleWktInput}
              icon="view"
            />
          </InputRightElement>
        </InputGroup>
      )}

      <FormErrorMessage>{form.errors[name] && form.errors[name]["message"]}</FormErrorMessage>
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
}
