import { Box, Button, Flex, Input, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import ErrorMessage from "@components/form/common/error-message";
import { SelectInputField } from "@components/form/select";
import SITE_CONFIG from "@configs/site-config";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import useOnlineStatus from "@rehooks/online-status";
import { EXIF_GPS_FOUND } from "@static/events";
import { AUTOCOMPLETE_FIELDS, GEOCODE_OPTIONS, GMAP_LIBRARIES } from "@static/location";
import { translateOptions } from "@utils/i18n";
import { getMapCenter, reverseGeocode } from "@utils/location";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";
import { useListener } from "react-gbus";
import { useFormContext } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

import { LOCATION_ACCURACY_OPTIONS } from "../options";
import CoordinatesInput from "./coordinates";
import LocationMap from "./map";
import useLastLocation from "./use-last-location";

const LocationPicker = ({ isRequired = true }) => {
  const form = useFormContext();
  const { t } = useTranslation();
  const { latitude: lat, longitude: lng, zoom: initialZoom } = useMemo(() => getMapCenter(4), []);
  const [hideLocationPicker, setHideLocationPicker] = useState(true);
  const isOnline = useOnlineStatus();
  const ll = useLastLocation();
  const translatedLocationOptions = useMemo(
    () => translateOptions(t, LOCATION_ACCURACY_OPTIONS),
    []
  );

  const FK = {
    observedAt: {
      name: "observedAt",
      label: t("observation:observed_at")
    },
    reverseGeocoded: {
      name: "reverseGeocoded"
    },
    locationScale: {
      name: "locationScale",
      label: t("observation:location_scale")
    },
    latitude: {
      name: "latitude",
      label: t("observation:latitude")
    },
    longitude: {
      name: "longitude",
      label: t("observation:longitude")
    }
  };

  const watchLatLng = form.watch([FK.latitude.name, FK.longitude.name, "resources"]);

  const defaultValues = form.control._defaultValues;

  const { open, onToggle } = useDisclosure();
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
      if ((coordinates.lat === 0 && coordinates.lng === 0) || pos.isLast) {
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
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const point = { lat: latitude, lng: longitude };

        form.setValue(FK.latitude.name, latitude, { shouldDirty: true });
        form.setValue(FK.longitude.name, longitude, { shouldDirty: true });

        setCoordinates(point);
        setCenter(point);
        setZoom(18);

        try {
          const results = await reverseGeocode(point);
          if (results && results.length > 0) {
            setObservedAtText(results[0].formatted_address);
          } else {
            setObservedAtText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          setObservedAtText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      (error) => {
        console.error("Error retrieving geolocation position:", error);

        let errorMessage = "An unknown error occurred while fetching location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission was denied by the system.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The location request timed out. Try stepping outside.";
            break;
        }
        alert(`Geolocation Error: ${errorMessage}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );
  };

  // --- NEW DIAGNOSTIC CLICK HANDLER ---
  const handleLocationClick = (e) => {
    e.preventDefault();

    // 1. Check for Nginx blocking headers (using 'as any' to fix TypeScript error)
    try {
      const doc = document as any;
      if (doc.permissionsPolicy && !doc.permissionsPolicy.allowsFeature("geolocation")) {
        alert(
          "BANNED BY NGINX: The server's HTTP 'Permissions-Policy' header is blocking geolocation."
        );
        return;
      }
    } catch (err) {
      // Ignored if browser doesn't support document.permissionsPolicy
    }

    // 2. Check for Insecure Context (Invalid SSL)
    if (!window.isSecureContext) {
      alert("FAILED: Chrome thinks this is an insecure context, even with HTTPS.");
      return;
    }

    // 3. Query the browser's hardcoded permission state
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          alert(
            "DENIED: The browser has hard-blocked this site. If it's not in your site settings, you might be in an Incognito Tab, or Brave Shields are up."
          );
        } else {
          getCurrentLocation();
        }
      });
    } else {
      getCurrentLocation();
    }
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
          <Button mb={4} colorPalette="red" type="button" onClick={handleLocationClick}>
            Click Here for Manual Coordinates
          </Button>
        )}
        <SimpleGrid columns={[1, 1, 4, 4]} gap={4}>
          <Box style={{ gridColumn: "1/4" }}>
            <Field
              invalid={
                !!(
                  form.formState.errors[FK.observedAt.name] ||
                  form.formState.errors[FK.latitude.name] ||
                  form.formState.errors[FK.longitude.name]
                )
              }
              required={isRequired}
              htmlFor="places-search"
              label={
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}
                >
                  {FK.observedAt.label}
                  {/* Desktop Only Buttons */}
                  <Button
                    display={["none", "none", "inline-flex", "inline-flex"]}
                    type="button"
                    variant="plain"
                    size="xs"
                    colorPalette="blue"
                    onClick={handleLocationClick}
                  >
                    {t("observation:current_location", {
                      defaultValue: "Use Current Location"
                    })}
                  </Button>
                  {ll.has && (
                    <Button
                      display={["none", "none", "inline-flex", "inline-flex"]}
                      type="button"
                      title={ll.value?.address}
                      variant="plain"
                      size="xs"
                      colorPalette="blue"
                      onClick={(e) => {
                        e.preventDefault();
                        ll.use(e);
                      }}
                    >
                      {t("observation:last_location")}
                    </Button>
                  )}
                </div>
              }
            >
              {/* Mobile Only Buttons */}
              <Flex
                display={["flex", "flex", "none", "none"]}
                flexDirection="row"
                flexWrap="nowrap"
                gap="12px"
                mb={3}
                width="full"
                overflowX="auto"
                py={1}
              >
                <Button
                  type="button"
                  variant="subtle"
                  size="sm"
                  colorPalette="blue"
                  onClick={handleLocationClick}
                  whiteSpace="nowrap"
                >
                  {t("observation:current_location", {
                    defaultValue: "Use Current Location"
                  })}
                </Button>
                {ll.has && (
                  <Button
                    type="button"
                    title={ll.value?.address}
                    variant="subtle"
                    size="sm"
                    colorPalette="blue"
                    onClick={(e) => {
                      e.preventDefault();
                      ll.use(e);
                    }}
                    whiteSpace="nowrap"
                  >
                    {t("observation:last_location")}
                  </Button>
                )}
              </Flex>

              <InputGroup
                width={"full"}
                className="places-search"
                endElement={
                  <Box>
                    <Button
                      variant="plain"
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onToggle();
                      }}
                    >
                      {t(open ? "form:map.hide" : "form:map.show")}
                    </Button>
                  </Box>
                }
              >
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
                    required={false}
                    pr="5rem"
                    placeholder={t("observation:location_placeholder")}
                  />
                </Autocomplete>
              </InputGroup>

              <ErrorMessage name={FK.observedAt.name} errors={form.formState.errors} />
              {!open && (
                <>
                  <ErrorMessage name={FK.latitude.name} errors={form.formState.errors} />
                  <ErrorMessage name={FK.longitude.name} errors={form.formState.errors} />
                </>
              )}
            </Field>
          </Box>
          <SelectInputField
            {...FK.locationScale}
            options={translatedLocationOptions}
            shouldPortal={true}
          />
        </SimpleGrid>
        <CoordinatesInput
          show={open}
          fk={FK}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
        />
        <LocationMap
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          isOpen={open}
          onTextUpdate={setObservedAtText}
          zoom={zoom}
          center={center}
        />
      </>
    </LoadScriptNext>
  );
};

export default LocationPicker;
