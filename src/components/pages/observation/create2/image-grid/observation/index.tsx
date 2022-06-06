import { Box } from "@chakra-ui/react";
import { DatePickerNextField } from "@components/form/datepicker-next";
import { LocationInputField } from "@components/form/location-input";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFormContext } from "react-hook-form";

import Recodata from "./recodata";
import Resources from "./resources";

export default function ObservationBox({ remove, index }) {
  const { t } = useTranslation();
  const form = useFormContext();

  const isSelected = form.watch(`o.${index}.isSelected`);

  const handleOnSelection = (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains("o-selectable")) {
      form.setValue(`o.${index}.isSelected`, !isSelected);
    }
  };

  return (
    <Box
      borderColor={isSelected ? "blue.500" : "gray.300"}
      borderRadius="md"
      borderWidth="2px"
      className="white-box fade"
      flex="0 0 250px"
      m="2px"
      mr={4}
      onClick={handleOnSelection}
      p={2}
      scrollSnapAlign="center"
      transition="0.1s ease"
    >
      <Resources index={index} removeObservation={remove} />
      <Recodata index={index} />
      <DatePickerNextField
        mb={2}
        name={`o.${index}.observedOn`}
        placeholder={t("common:observed_on")}
      />
      <LocationInputField
        latName={`o.${index}.latitude`}
        lngName={`o.${index}.longitude`}
        mb={0}
        name={`o.${index}.observedAt`}
        placeholder={t("observation:observed_at")}
      />
    </Box>
  );
}
