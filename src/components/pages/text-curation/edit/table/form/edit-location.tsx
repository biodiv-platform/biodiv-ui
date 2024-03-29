import { Box, Button, HStack, Input, Tag, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { axGetPeliasAutocompleteLocations } from "@services/curate.service";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

const MapWithNoSSR = dynamic(() => import("./map-locations"), {
  ssr: false
});

export default function LocationEdit({ row }) {
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
        locationAccuracy: value.locationAccuracy,
        country: value.country,
        countryCode: value.countryCode
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

    hForm.setValue("country", value.country ? value.country : row.country);
    hForm.setValue("countryCode", value.countryCode ? value.countryCode : row.countryCode);
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

  const [listOfLocations, setListOfLocations] = useState([...row.peliasLocations.slice(0, 4)]);

  const [hasMore, setHasMore] = useState(row.peliasLocations.length > 4);

  const handleLoadMore = () => {
    if (hasMore) {
      const currentLength = listOfLocations.length;
      const hasMoreLocations = currentLength < row.peliasLocations.length;
      setHasMore(hasMoreLocations);
      const nextResults = hasMoreLocations
        ? row.peliasLocations.slice(currentLength, row.peliasLocations.length)
        : [];
      setListOfLocations([...listOfLocations, ...nextResults]);
    }
  };

  const reducedListOfLocations = useMemo(
    () => row.peliasLocations.slice(0, 4),
    [row.peliasLocations]
  );

  const handleCollapse = () => {
    setListOfLocations(reducedListOfLocations);
  };

  return (
    <Box p={4} mb={4}>
      {row.peliasLocations.length > 0 && (
        <Box>
          <Button
            variant="solid"
            colorScheme="gray"
            size="sm"
            onClick={onToggle}
            mb={4}
            borderColor="gray.300"
            borderWidth="medium"
          >
            {isOpen
              ? t("text-curation:edit.location.collapse_map")
              : t("text-curation:edit.location.show_on_map")}
          </Button>

          {isOpen && (
            <MapWithNoSSR
              row={row}
              setLatitude={setLatitude}
              setLongitude={setlongitude}
              setLocationAccuracy={setLocationAccuracy}
              hForm={hForm}
              locationRef={locationRef}
              isOpen={isOpen}
            />
          )}
        </Box>
      )}

      <Box>
        {listOfLocations.map((suggestion: any) => (
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

        {listOfLocations.length < row.peliasLocations.length && (
          <Button variant="link" onClick={handleLoadMore} colorScheme="blue">
            {t("text-curation:edit.location.show_all")}
          </Button>
        )}
        {listOfLocations.length === row.peliasLocations.length && listOfLocations.length > 4 && (
          <Button variant="link" onClick={handleCollapse} colorScheme="blue">
            {t("text-curation:edit.location.show_fewer")}
          </Button>
        )}
      </Box>

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
        {locationAccuracy && (
          <Tag mb={4}>
            {t("text-curation:edit.location.accuracy")} : {locationAccuracy}
          </Tag>
        )}

        <HStack mb={2}>
          <VStack align="flex-start">
            <Text>{t("text-curation:edit.location.longitude")}</Text>
            <Input value={longitude} onChange={handleLonChange} placeholder="longitude" size="md" />
          </VStack>

          <VStack align="flex-start">
            <Text>{t("text-curation:edit.location.latitude")}</Text>
            <Input value={latitude} onChange={handleLatChange} placeholder="longitude" size="md" />
          </VStack>
        </HStack>

        <HStack mb={2}>
          <SelectInputField
            shouldPortal={true}
            name="locationAccuracy"
            label={t("text-curation:edit.location.edit_location_accuracy")}
            options={accuracyOptions.map((o) => ({ label: o, value: o }))}
            onChangeCallback={handleOnOptionSelect}
          />
        </HStack>
      </Box>
    </Box>
  );
}
