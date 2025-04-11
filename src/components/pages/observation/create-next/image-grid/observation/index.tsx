import { Box, Button } from "@chakra-ui/react";
import { DatePickerNextField } from "@components/form/datepicker-next";
import { LocationInputField } from "@components/form/location-input";
import EditIcon from "@icons/edit";
import { OBSERVATION_BULK_EDIT } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { emit } from "react-gbus";
import { useFormContext } from "react-hook-form";

import CustomfieldsError from "./customfields-error";
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

  const handleOnEdit = () => {
    emit(OBSERVATION_BULK_EDIT, {
      data: form.getValues(`o.${index}`),
      applyIndex: index
    });
  };

  return (
    <Box
      borderColor={isSelected ? "blue.500" : "gray.300"}
      borderRadius="md"
      borderWidth="3px"
      className="white-box fade"
      flex="0 0 220px"
      m="2px"
      _hover={{ borderColor: isSelected ? "blue.500" : "blue.200" }}
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
        name={`o.${index}.observedAt`}
        placeholder={t("observation:observed_at")}
        mb={2}
      />
      <Button w="full" onClick={handleOnEdit}>
        <EditIcon />
        {t("observation:more_fields")}
      </Button>
      <CustomfieldsError idx={index} />
    </Box>
  );
}
