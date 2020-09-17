import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure
} from "@chakra-ui/core";
import ErrorMessage from "@components/form/common/error-message";
import useTranslation from "@configs/i18n/useTranslation";
import SITE_CONFIG from "@configs/site-config.json";
import { LoadScriptNext, StandaloneSearchBox } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

import LocationMap from "../../observation/create/form/location/map";

const LIBRARIES = ["drawing", "places"];

const LocationPicker = ({ form }) => {
  const { t } = useTranslation();
  const { latitude: lat, longitude: lng } = SITE_CONFIG.MAP.CENTER;
  const FK = {
    location: {
      name: "location",
      label: t("USER.LOCATION")
    },
    latitude: {
      name: "latitude",
      label: t("USER.LATITUDE")
    },
    longitude: {
      name: "longitude",
      label: t("USER.LONGITUDE")
    }
  };

  const { isOpen, onToggle } = useDisclosure();
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState({ lat, lng });
  const [searchBoxRef, setSearchBoxRef] = useState<any>();
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: form.control.defaultValuesRef.current[FK.latitude.name] || 0,
    lng: form.control.defaultValuesRef.current[FK.longitude.name] || 0
  });
  const [locationText, setLocationText] = useState(
    form.control.defaultValuesRef.current[FK.location.name]
  );

  useEffect(() => {
    if (suggestions.length) {
      const suggestion = suggestions[0];
      const point = {
        lat: suggestion.geometry.location.lat(),
        lng: suggestion.geometry.location.lng()
      };
      setZoom(18);
      setCenter(point);
      setLocationText(suggestion.formatted_address);
      setCoordinates(point);
    }
  }, [suggestions]);

  useEffect(() => {
    if (coordinates) {
      form.setValue(FK.latitude.name, coordinates.lat);
      form.setValue(FK.longitude.name, coordinates.lng);
    }
  }, [coordinates]);

  useEffect(() => {
    form.setValue(FK.location.name, locationText);
  }, [locationText]);

  useEffect(() => {
    form.register({ name: FK.location.name });
    form.register({ name: FK.latitude.name });
    form.register({ name: FK.longitude.name });
  }, [form.register]);

  const handleOnSearchChange = (e) => {
    setLocationText(e.target.value);
  };

  const handleOnSearchSelected = async () => {
    setSuggestions(searchBoxRef.getPlaces());
  };

  return (
    <LoadScriptNext
      id="user-registration-map-script-loader"
      googleMapsApiKey={SITE_CONFIG.TOKENS.GMAP}
      libraries={LIBRARIES}
    >
      <>
        <Box mb={4}>
          <FormControl isInvalid={form.errors[FK.location.name] && true}>
            <FormLabel>{FK.location.label}</FormLabel>
            <InputGroup size="md" className="places-search">
              <StandaloneSearchBox
                onLoad={setSearchBoxRef}
                onPlacesChanged={handleOnSearchSelected}
                options={{ componentRestrictions: { country: "in" } }}
              >
                <Input
                  value={locationText}
                  onChange={handleOnSearchChange}
                  isRequired={false}
                  pr="5rem"
                />
              </StandaloneSearchBox>
              <InputRightElement width="5rem" mr={2}>
                <Button h="1.6rem" size="sm" onClick={onToggle}>
                  {t(`OBSERVATION.MAP.${isOpen ? "HIDE" : "SHOW"}`)}
                </Button>
              </InputRightElement>
            </InputGroup>
            <ErrorMessage name={FK.location.name} errors={form.errors} />
          </FormControl>
        </Box>
        <LocationMap
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          isOpen={isOpen}
          onTextUpdate={setLocationText}
          zoom={zoom}
          center={center}
        />
      </>
    </LoadScriptNext>
  );
};

export default LocationPicker;
