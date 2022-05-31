import { Box, Button, HStack, Input, Tag, useDisclosure, VStack } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { axGetPeliasAutocompleteLocations } from "@services/curate.service";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function LocationEdit({ row }) {
  const MapWithNoSSR = dynamic(() => import("./map-locations"), {
    ssr: false
  });
  const { isOpen, onToggle } = useDisclosure();
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

  const handleLonChange = (event) => {
    setlongitude(event.target.value);
    hForm.setValue("longitude", event.target.value);
  };
  const handleLatChange = (event) => {
    setLatitude(event.target.value);
    hForm.setValue("latitude", event.target.value);
  };

  return (
    <Box p={4} mb={4}>
      <Button
        variant="solid"
        colorScheme="gray"
        size="sm"
        onClick={onToggle}
        mb={4}
        borderColor="gray.300"
        borderWidth="medium"
      >
        {isOpen ? "Collapse map" : "Show locations on map"}
      </Button>
      <MapWithNoSSR
        row={row}
        setLatitude={setLatitude}
        setLongitude={setlongitude}
        setLocationAccuracy={setLocationAccuracy}
        hForm={hForm}
        locationRef={locationRef}
        isOpen={isOpen}
      />

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
        {locationAccuracy && <Tag mb={4}>{`accuracy : ${locationAccuracy}`}</Tag>}

        <HStack mb={2}>
          <VStack align="flex-start">
            <Text>Longitude</Text>
            <Input value={longitude} onChange={handleLonChange} placeholder="longitude" size="md" />
          </VStack>

          <VStack align="flex-start">
            <Text>Latitude</Text>
            <Input value={latitude} onChange={handleLatChange} placeholder="longitude" size="md" />
          </VStack>
        </HStack>

        <HStack mb={2}>
          <SelectInputField
            shouldPortal={true}
            name="locationAccuracy"
            label="Edit Location accuracy"
            options={accuracyOptions.map((o) => ({ label: o, value: o }))}
            onChangeCallback={handleOnOptionSelect}
          />
        </HStack>
      </Box>
    </Box>
  );
}
