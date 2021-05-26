import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  useDisclosure
} from "@chakra-ui/react";
import ErrorMessage from "@components/form/common/error-message";
import { SelectInputField } from "@components/form/select";
import SITE_CONFIG from "@configs/site-config.json";
import useTranslation from "@hooks/use-translation";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import useOnlineStatus from "@rehooks/online-status";
import { EXIF_GPS_FOUND } from "@static/events";
import { AUTOCOMPLETE_FIELDS, GEOCODE_OPTIONS, GMAP_LIBRARIES } from "@static/location";
import { getMapCenter, reverseGeocode } from "@utils/location";
import React, { useEffect, useMemo, useState } from "react";
import { useListener } from "react-gbus";
import { useFormContext } from "react-hook-form";

import { LOCATION_ACCURACY_OPTIONS } from "../options";
import CoordinatesInput from "./coordinates";
import LocationMap from "./map";
import useLastLocation from "./use-last-location";

const LocationPicker = () => {
  const form = useFormContext();
  const { t } = useTranslation();
  const { latitude: lat, longitude: lng, zoom: initialZoom } = useMemo(() => getMapCenter(4), []);
  const [hideLocationPicker, setHideLocationPicker] = useState(true);
  const isOnline = useOnlineStatus();
  const ll = useLastLocation();

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
  const [zoom, setZoom] = useState(initialZoom);
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
        if (pos.address) {
          setObservedAtText(pos.address);
        } else {
          reverseGeocode(pos).then((r) => r.length && setObservedAtText(r[0].formatted_address));
        }
      }
    },
    [EXIF_GPS_FOUND]
  );

  useEffect(() => {
    form.register(FK.observedAt.name);
    form.register(FK.reverseGeocoded.name);
    form.register(FK.latitude.name);
    form.register(FK.longitude.name);
  }, [form.register]);

  useEffect(() => {
    if (watchLatLng["resources"]?.length > 0) {
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
      region={SITE_CONFIG.MAP.COUNTRY}
      libraries={GMAP_LIBRARIES}
    >
      <>
        {!isOnline && !hideLocationPicker && (
          <Button mb={4} colorScheme="red" onClick={getCurrentLocation}>
            Click Here for Manual Coordinates
          </Button>
        )}
        <SimpleGrid columns={[1, 1, 4, 4]} spacing={4}>
          <Box style={{ gridColumn: "1/4" }}>
            <FormControl
              isInvalid={
                (form.formState.errors[FK.observedAt.name] ||
                  form.formState.errors[FK.latitude.name] ||
                  form.formState.errors[FK.longitude.name]) &&
                true
              }
              isRequired={true}
            >
              <FormLabel htmlFor="places-search">
                {FK.observedAt.label}
                {ll.has && (
                  <Button
                    title={ll.value?.address}
                    variant="link"
                    size="xs"
                    ml={1}
                    verticalAlign="baseline"
                    colorScheme="blue"
                    onClick={ll.use}
                  >
                    {t("OBSERVATION.LAST_LOCATION")}
                  </Button>
                )}
              </FormLabel>
              <InputGroup size="md" className="places-search">
                <Autocomplete
                  onLoad={setSearchBoxRef}
                  onPlaceChanged={handleOnSearchSelected}
                  options={GEOCODE_OPTIONS}
                  fields={AUTOCOMPLETE_FIELDS}
                >
                  <Input
                    id="places-search"
                    value={observedAtText}
                    onChange={handleOnSearchChange}
                    isRequired={false}
                    pr="5rem"
                  />
                </Autocomplete>
                <InputRightElement w="7rem">
                  <Button variant="link" size="sm" onClick={onToggle}>
                    {t(isOpen ? "OBSERVATION.MAP.HIDE" : "OBSERVATION.MAP.SHOW")}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <ErrorMessage name={FK.observedAt.name} errors={form.formState.errors} />
              {!isOpen && (
                <>
                  <ErrorMessage name={FK.latitude.name} errors={form.formState.errors} />
                  <ErrorMessage name={FK.longitude.name} errors={form.formState.errors} />
                </>
              )}
            </FormControl>
          </Box>
          <SelectInputField {...FK.locationScale} options={LOCATION_ACCURACY_OPTIONS} />
        </SimpleGrid>
        <CoordinatesInput
          show={isOpen}
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
