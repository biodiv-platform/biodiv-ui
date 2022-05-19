import { Box, Button, HStack, Tag } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { axGetPeliasAutocompleteLocations } from "@services/curate.service";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import MapSuggedtedLocations from "./map-locations";

export default function LocationEdit({ row }) {
  // const MapWithNoSSR = dynamic(() => import("./map-locations"), {
  //   ssr: false
  // });
  const { t } = useTranslation();
  const hForm = useFormContext();
  const locationRef: any = useRef(null);

  const [latitude, setLatitude] = useState();
  const [longitude, setlongitude] = useState();
  const [locationAccuracy, setLocationAccuracy] = useState();

  const accuracyOptions = [
    "Accurate",
    "Approximate-Local",
    "Approximate-Region",
    "Approximate-Country"
  ];

  const onTagSelect = (value) => {
    setLatitude(value.coordinates[1]);
    setlongitude(value.coordinates[0]);
    setLocationAccuracy(value.locationAccuracy);
    locationRef.current.onChange(
      {
        value: value.label,
        label: value.label,
        coordinates: value.coordinates,
        locationAccuracy: value.locationAccuracy
      },
      { name: locationRef.current.props.inputId }
    );
  };

  const handleOnChange = (value) => {
    setlongitude(value.coordinates ? value.coordinates[0] : row.longitude);
    setLatitude(value.coordinates ? value.coordinates[1] : row.latitude);
    setLocationAccuracy(value.locationAccuracy ? value.locationAccuracy : row.locationAccuracy);

    hForm.setValue("longitude", value.coordinates ? value.coordinates[0] : row.longitude);
    hForm.setValue("latitude", value.coordinates ? value.coordinates[1] : row.latitude);
    hForm.setValue(
      "locationAccuracy",
      value.locationAccuracy ? value.locationAccuracy : row.locationAccuracy
    );
  };

  const handleOnOptionSelect = (value) => {
    setLocationAccuracy(value);
  };

  return (
    <Box p={4} mb={4}>
      <SelectAsyncInputField
        resetOnSubmit={false}
        name="curatedLocation"
        label={t("text-curation:curated.location")}
        multiple={false}
        mb={3}
        onQuery={axGetPeliasAutocompleteLocations}
        onChange={handleOnChange}
        selectRef={locationRef}
        isRaw={true}
      />
      <Box mb={4}>
        <HStack spacing={4} mb={4}>
          {longitude && <Tag>{`longitude : ${longitude}`}</Tag>}
          {latitude && <Tag>{`latitude : ${latitude}`}</Tag>}
          {locationAccuracy && <Tag>{`accuracy : ${locationAccuracy}`}</Tag>}
        </HStack>
        <SelectInputField
          name="locationAccuracy"
          label="Location accuracy"
          options={accuracyOptions.map((o) => ({ label: o, value: o }))}
          onChangeCallback={handleOnOptionSelect}
          mb={0}
        />
      </Box>

      <MapSuggedtedLocations />

      {row.peliasLocations.map((suggestion: any) => (
        <Button
          variant="outline"
          size="xs"
          bg="blue.50"
          key={suggestion.coordinates.toString()}
          colorScheme="blue"
          borderRadius="3xl"
          onClick={() => onTagSelect(suggestion)}
          mb={2}
          mr={2}
        >
          {suggestion.label}
          {" " + "(" + suggestion.coordinates[0] + ", " + suggestion.coordinates[1] + ")"}
        </Button>
      ))}
    </Box>
  );
}
