import { Button, Input, SimpleGrid } from "@chakra-ui/react";
import { WKTProps } from "@components/@core/WKT";
import SaveButton from "@components/@core/WKT/save-button";
import LocationMap from "@components/pages/observation/create/form/location/map";
import useLastLocation from "@components/pages/observation/create/form/location/use-last-location";
import SITE_CONFIG from "@configs/site-config";
import { Autocomplete, LoadScriptNext } from "@react-google-maps/api";
import { EXIF_GPS_FOUND } from "@static/events";
import { AUTOCOMPLETE_FIELDS, GEOCODE_OPTIONS, GMAP_LIBRARIES } from "@static/location";
import midPoint from "@turf/center";
import { feature } from "@turf/helpers";
import { getMapCenter } from "@utils/location";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";
import { useListener } from "react-gbus";
import wkt from "wkt";

import { Field } from "@/components/ui/field";

const GmapsWktLocationPicker = ({
  nameTitle,
  nameTopology,
  centroid,
  label,
  mb = 4,
  disabled,
  onSave
}: WKTProps) => {
  const { t } = useTranslation();
  const { latitude: lat, longitude: lng, zoom: initialZoom } = useMemo(() => getMapCenter(4), []);
  const ll = useLastLocation();

  const [zoom, setZoom] = useState(initialZoom);
  const [center, setCenter] = useState({ lat, lng });
  const [searchBoxRef, setSearchBoxRef] = useState<any>();
  const [suggestion, setSuggestion] = useState<any>();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>();
  const [observedAtText, setObservedAtText] = useState<string>();

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

  const handleOnSave = () => {
    if (observedAtText && coordinates?.lng && coordinates?.lat) {
      onSave({
        [nameTitle]: observedAtText,
        [nameTopology]: `POINT (${coordinates.lng} ${coordinates.lat})`,
        [centroid]: midPoint(feature(wkt.parse(`POINT (${coordinates.lng} ${coordinates.lat})`)))
      });

      // Reset Fields
      setCoordinates(undefined);
      setObservedAtText("");
    } else {
      notification("Valid PlaceName and WKT both are required");
    }
  };

  const handleOnSearchChange = (e) => {
    setObservedAtText(e.target.value);
  };

  const handleOnSearchSelected = async () => {
    setSuggestion(searchBoxRef.getPlace());
  };

  useListener(
    async (pos) => {
      setCoordinates(pos);
      if (pos.address) {
        setObservedAtText(pos.address);
      }
    },
    [EXIF_GPS_FOUND]
  );

  return (
    <LoadScriptNext
      id="observation-create-map-script-loader"
      googleMapsApiKey={SITE_CONFIG.TOKENS.GMAP}
      region={SITE_CONFIG.MAP.COUNTRY}
      libraries={GMAP_LIBRARIES}
    >
      <>
        <SimpleGrid columns={[1 / 2, 1 / 2, 5, 5]} gap={3} mb={mb}>
          <Field gridColumn={"1/5"}>
            <Field htmlFor="places-search">
              {label}
              {ll.has && (
                <Button
                  title={ll.value?.address}
                  size="xs"
                  ml={1}
                  verticalAlign="baseline"
                  colorPalette="blue"
                  onClick={ll.use}
                >
                  {t("observation:last_location")}
                </Button>
              )}
            </Field>
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
                pr="5rem"
                placeholder={t("observation:location_placeholder")}
              />
            </Autocomplete>
          </Field>
          <SaveButton disabled={disabled} onClick={handleOnSave} />
        </SimpleGrid>
        <LocationMap
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          isOpen={true}
          onTextUpdate={setObservedAtText}
          zoom={zoom}
          center={center}
        />
      </>
    </LoadScriptNext>
  );
};

export default GmapsWktLocationPicker;
