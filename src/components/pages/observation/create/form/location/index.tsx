import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  useDisclosure
} from "@chakra-ui/core";
import Select from "@components/form/select";
import useTranslation from "@configs/i18n/useTranslation";
import SITE_CONFIG from "@configs/site-config.json";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import useOnlineStatus from "@rehooks/online-status";
import { EXIF_GPS_FOUND } from "@static/events";
import { reverseGeocode } from "@utils/location";
import React, { useEffect, useState } from "react";
import { useListener } from "react-gbus";
import { UseFormMethods } from "react-hook-form";

import { LOCATION_ACCURACY_OPTIONS } from "../options";
import CoordinatesInput from "./coordinates";
import LocationMap from "./map";

interface LocationPickerProps {
  form: UseFormMethods<Record<string, any>>;
}

const LIBRARIES = ["drawing", "places"];

const LocationPicker = ({ form }: LocationPickerProps) => {
  const { t } = useTranslation();
  const { latitude: lat, longitude: lng } = SITE_CONFIG.MAP.CENTER;
  const [hideLocationPicker, setHideLocationPicker] = useState(true);
  const isOnline = useOnlineStatus();

  const FK = {
    observedAt: {
      name: "observedAt",
      label: t("OBSERVATION.OBSERVED_AT")
    },
    reverseGeocoded: {
      name: "reverseGeocoded"
    },
    locationScale: {
      name: "locationScale",
      label: t("OBSERVATION.LOCATION_SCALE")
    },
    latitude: {
      name: "latitude",
      label: t("OBSERVATION.LATITUDE")
    },
    longitude: {
      name: "longitude",
      label: t("OBSERVATION.LONGITUDE")
    }
  };

  const watchLatLng = form.watch([FK.latitude.name, FK.longitude.name, "resources"]);

  const defaultValues = form.control.defaultValuesRef.current;

  const { isOpen, onToggle } = useDisclosure();
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState({ lat, lng });
  const [searchBoxRef, setSearchBoxRef] = useState<any>();
  const [suggestion, setSuggestion] = useState<any>();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: defaultValues[FK.latitude.name],
    lng: defaultValues[FK.longitude.name]
  });
  const [observedAtText, setObservedAtText] = useState(defaultValues[FK.observedAt.name]);

  useEffect(() => {
    if (suggestion) {
      const point = {
        lat: suggestion.geometry.location.lat(),
        lng: suggestion.geometry.location.lng()
      };
      setZoom(18);
      setCenter(point);
      setObservedAtText(suggestion.formatted_address);
      setCoordinates(point);
    }
  }, [suggestion]);

  useEffect(() => {
    if (coordinates) {
      form.setValue(FK.latitude.name, coordinates.lat, { shouldDirty: true });
      form.setValue(FK.longitude.name, coordinates.lng, { shouldDirty: true });
    }
  }, [coordinates]);

  useEffect(() => {
    form.setValue(FK.observedAt.name, observedAtText, { shouldDirty: true });
    form.setValue(FK.reverseGeocoded.name, observedAtText, { shouldDirty: true });
  }, [observedAtText]);

  useListener(
    async (pos) => {
      if (coordinates.lat === 0 && coordinates.lng === 0) {
        setCoordinates(pos);
        reverseGeocode(pos).then((r) => r.length && setObservedAtText(r[0].formatted_address));
      }
    },
    [EXIF_GPS_FOUND]
  );

  useEffect(() => {
    form.register({ name: FK.observedAt.name });
    form.register({ name: FK.reverseGeocoded.name });
    form.register({ name: FK.latitude.name });
    form.register({ name: FK.longitude.name });
  }, [form.register]);

  useEffect(() => {
    if (watchLatLng["resources"].length > 0) {
      setHideLocationPicker(watchLatLng["latitude"] > 0 && watchLatLng["longitude"] > 0);
    }
  }, [watchLatLng]);

  const handleOnSearchChange = (e) => {
    setObservedAtText(e.target.value);
  };

  const handleOnSearchSelected = async () => {
    setSuggestion(searchBoxRef.getPlace());
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      form.setValue(FK.latitude.name, latitude);
      form.setValue(FK.longitude.name, longitude);
    });
  };

  return (
    <LoadScriptNext
      id="observation-create-map-script-loader"
      googleMapsApiKey={SITE_CONFIG.TOKENS.GMAP}
      libraries={LIBRARIES}
    >
      <>
        {!isOnline && !hideLocationPicker && (
          <Button mb={4} variantColor="red" onClick={getCurrentLocation}>
            Click Here for Manual Coordinates
          </Button>
        )}
        <SimpleGrid columns={[1, 1, 4, 4]} spacing={4}>
          <Box style={{ gridColumn: "1/4" }}>
            <FormControl isInvalid={form.errors[FK.observedAt.name] && true} isRequired={true}>
              <FormLabel htmlFor="places-search">{FK.observedAt.label}</FormLabel>
              <InputGroup size="md" className="places-search">
                <Autocomplete
                  onLoad={setSearchBoxRef}
                  onPlaceChanged={handleOnSearchSelected}
                  options={{ componentRestrictions: { country: SITE_CONFIG.MAP.COUNTRY } }}
                >
                  <Input
                    id="places-search"
                    value={observedAtText}
                    onChange={handleOnSearchChange}
                    isRequired={false}
                    pr="5rem"
                  />
                </Autocomplete>
                <InputRightElement justifyContent="flex-end" width={"5rem"} mr={2}>
                  <Button h="1.6rem" size="sm" onClick={onToggle}>
                    {t(`OBSERVATION.MAP.${isOpen ? "HIDE" : "SHOW"}`)}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {form.errors[FK.observedAt.name] && form.errors[FK.observedAt.name]["message"]}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Select {...FK.locationScale} options={LOCATION_ACCURACY_OPTIONS} form={form} />
        </SimpleGrid>
        <CoordinatesInput
          show={isOpen}
          form={form}
          fk={FK}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
        />
        <LocationMap
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          isOpen={isOpen}
          onTextUpdate={setObservedAtText}
          zoom={zoom}
          center={center}
        />
      </>
    </LoadScriptNext>
  );
};

export default LocationPicker;
