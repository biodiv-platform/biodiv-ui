import { Box, Button } from "@chakra-ui/react";
import { HStack,Tag } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import { axGetPeliasAutocompleteLocations } from "@services/curate.service";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function LocationEdit({ row }) {
  const { t } = useTranslation();
  const hForm = useFormContext();
  const locationRef: any = useRef(null);

  const [latitude, setLatitude] = useState();
  const [longitude, setlongitude] = useState();

  const onTagSelect = (value) => {
    setLatitude(value.coordinates[1]);
    setlongitude(value.coordinates[0]);

    locationRef.current.onChange(
      { value: value.label, label: value.label, coordinates: value.coordinates },
      { name: locationRef.current.props.inputId }
    );
  };

  const handleOnChange = (value) => {
    setlongitude(value.coordinates ? value.coordinates[0] : row.longitude);
    setLatitude(value.coordinates ? value.coordinates[1] : row.latitude);

    hForm.setValue("longitude", value.coordinates ? value.coordinates[0] : row.longitude);
    hForm.setValue("latitude", value.coordinates ? value.coordinates[1] : row.latitude);
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
        <HStack spacing={4}>
          {longitude && <Tag>{`longitude : ${longitude}`}</Tag>}
          {latitude && <Tag>{`latitude : ${latitude}`}</Tag>}
        </HStack>
      </Box>

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
