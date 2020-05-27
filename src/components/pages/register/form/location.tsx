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
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { LoadScriptNext, StandaloneSearchBox } from "@react-google-maps/api";
import { MAP_CENTER } from "@static/constants";
import React, { useEffect, useState } from "react";

import LocationMap from "../../observation/create/form/location/map";

const LIBRARIES = ["drawing", "places"];

interface IDisclosure {
  defaultIsOpen: boolean;
}

const LocationPicker = ({ form }) => {
  const { t } = useTranslation();

  const { isOpen, onToggle } = useDisclosure();
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState(MAP_CENTER);
  const [searchBoxRef, setSearchBoxRef] = useState<any>();
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [locationText, setLocationText] = useState("");
  const FK = {
    location: {
      name: "location",
      label: t("SIGN_UP.FORM.LOCATION")
    },
    latitude: {
      name: "latitude",
      label: t("SIGN_UP.FORM.LATITUDE")
    },
    longitude: {
      name: "longitude",
      label: t("SIGN_UP.FORM.LONGITUDE")
    }
  };

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
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}
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
            <FormErrorMessage>
              {form.errors[FK.location.name] && form.errors[FK.location.name]["message"]}
            </FormErrorMessage>
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
