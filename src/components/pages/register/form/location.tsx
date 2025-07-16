import { Box, Button, Input, useDisclosure } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import { INVALID_COORDINATE } from "@static/constants";
import { AUTOCOMPLETE_FIELDS, GMAP_LIBRARIES } from "@static/location";
import { getMapCenter } from "@utils/location";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

import LocationMap from "../../observation/create/form/location/map";

export const LocationPicker = () => {
  const { t } = useTranslation();
  const { latitude: lat, longitude: lng, zoom: initialZoom } = getMapCenter(4);

  const fieldLocationName = useController({ name: "location", defaultValue: "" });
  const fieldLocationLat = useController({
    name: "latitude",
    defaultValue: INVALID_COORDINATE.LATITUDE
  });
  const fieldLocationLng = useController({
    name: "longitude",
    defaultValue: INVALID_COORDINATE.LONGITUDE
  });

  const coordinates = useMemo(
    () => ({
      lat: fieldLocationLat.field.value,
      lng: fieldLocationLng.field.value
    }),
    [fieldLocationLat, fieldLocationLng]
  );

  const setCoordinates = ({ lat, lng }) => {
    fieldLocationLat.field.onChange(lat);
    fieldLocationLng.field.onChange(lng);
  };

  const { open, onToggle } = useDisclosure();
  const [zoom, setZoom] = useState(initialZoom);
  const [center, setCenter] = useState({ lat, lng });
  const [searchBoxRef, setSearchBoxRef] = useState<any>();
  const [suggestion, setSuggestion] = useState<any>();

  useEffect(() => {
    if (suggestion) {
      const point = {
        lat: suggestion.geometry.location.lat(),
        lng: suggestion.geometry.location.lng()
      };
      setZoom(18);
      setCenter(point);
      fieldLocationName.field.onChange(suggestion.formatted_address);
      setCoordinates(point);
    }
  }, [suggestion]);

  const handleOnSearchSelected = async () => {
    setSuggestion(searchBoxRef.getPlace());
  };

  return (
    <LoadScriptNext
      id="user-registration-map-script-loader"
      googleMapsApiKey={SITE_CONFIG.TOKENS.GMAP}
      region={SITE_CONFIG.MAP.COUNTRY}
      libraries={GMAP_LIBRARIES}
    >
      <>
        <Box mb={4}>
          <Field
            invalid={!!fieldLocationName.fieldState.error}
            errorText={fieldLocationName.fieldState?.error?.message}
            label={t("user:location")}
          >
            <InputGroup
              width={"full"}
              flex="1"
              className="places-search"
              endElement={
                <Button variant="plain" size="sm" onClick={onToggle}>
                  {t(open ? "form:map.hide" : "form:map.show")}
                </Button>
              }
            >
              <Autocomplete
                onLoad={setSearchBoxRef}
                onPlaceChanged={handleOnSearchSelected}
                fields={AUTOCOMPLETE_FIELDS}
              >
                <Input {...fieldLocationName.field} required={false} pr="5rem" />
              </Autocomplete>
            </InputGroup>
          </Field>
        </Box>
        <LocationMap
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          isOpen={open}
          onTextUpdate={fieldLocationName.field.onChange}
          zoom={zoom}
          center={center}
        />
      </>
    </LoadScriptNext>
  );
};
