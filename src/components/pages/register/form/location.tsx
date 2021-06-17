import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure
} from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import { AUTOCOMPLETE_FIELDS, GMAP_LIBRARIES } from "@static/location";
import { getMapCenter } from "@utils/location";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";
import { useController } from "react-hook-form";

import LocationMap from "../../observation/create/form/location/map";

export const LocationPicker = () => {
  const { t } = useTranslation();
  const { latitude: lat, longitude: lng, zoom: initialZoom } = getMapCenter(4);

  const fieldLocationName = useController({ name: "location", defaultValue: "" });
  const fieldLocationLat = useController({ name: "latitude", defaultValue: 0 });
  const fieldLocationLng = useController({ name: "longitude", defaultValue: 0 });

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

  const { isOpen, onToggle } = useDisclosure();
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
          <FormControl isInvalid={fieldLocationName.fieldState.invalid}>
            <FormLabel>{t("user:location")}</FormLabel>
            <InputGroup size="md" className="places-search">
              <Autocomplete
                onLoad={setSearchBoxRef}
                onPlaceChanged={handleOnSearchSelected}
                fields={AUTOCOMPLETE_FIELDS}
              >
                <Input {...fieldLocationName.field} isRequired={false} pr="5rem" />
              </Autocomplete>
              <InputRightElement w="7rem">
                <Button variant="link" size="sm" onClick={onToggle}>
                  {t(isOpen ? "form:map.hide" : "form:map.show")}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage children={fieldLocationName.fieldState?.error?.message} />
          </FormControl>
        </Box>
        <LocationMap
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          isOpen={isOpen}
          onTextUpdate={fieldLocationName.field.onChange}
          zoom={zoom}
          center={center}
        />
      </>
    </LoadScriptNext>
  );
};
