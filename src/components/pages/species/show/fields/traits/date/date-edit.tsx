import "flatpickr/dist/themes/material_blue.css";

import { Box, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import useSpecies from "@components/pages/species/show/use-species";
import CalendarIcon from "@icons/calendar";
import { axUpdateSpeciesTrait } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import Flatpickr from "react-flatpickr";

import { TraitEditFooter } from "../common/edit-footer";

const parseInitialDateRange = (data) => {
  if (data.length) {
    const [{ fromDate, toDate }] = data;
    [new Date(fromDate), new Date(toDate)];
  }
  return [];
};

export function TraitDateEdit({ traitId, initialValue, onSave, onClose }) {
  const [value, setValue] = useState<Date[]>(parseInitialDateRange(initialValue));
  const { t } = useTranslation();

  const {
    species: {
      species: { id: speciesId, taxonConceptId }
    }
  } = useSpecies();

  const handleOnSave = async () => {
    const payload = {
      pageTaxonId: taxonConceptId,
      valuesString: [value.map((d) => d.toISOString().split("t")[0]).join(":")]
    };

    const { success } = await axUpdateSpeciesTrait(speciesId, traitId, payload);
    if (success) {
      onSave([{ fromDate: value[0], toDate: value[1] }]);
      onClose();
      notification(t("species:traits.update.success"), NotificationType.Success);
    } else {
      notification(t("species:traits.update.failure"));
    }
  };

  return (
    <div>
      <Box mb={3} maxW="md">
        <InputGroup>
          <Flatpickr
            value={value}
            options={{ allowInput: true, dateFormat: "d-m-Y", mode: "range" }}
            onChange={setValue}
            render={({ defaultValue, value, ...props }, ref) => (
              <Input id={traitId} {...props} defaultValue={defaultValue} ref={ref} />
            )}
          />
          <InputRightElement>
            <label htmlFor={traitId} style={{ cursor: "pointer" }}>
              <CalendarIcon color="gray.300" />
            </label>
          </InputRightElement>
        </InputGroup>
      </Box>
      <TraitEditFooter onSave={handleOnSave} onCancel={onClose} />
    </div>
  );
}
