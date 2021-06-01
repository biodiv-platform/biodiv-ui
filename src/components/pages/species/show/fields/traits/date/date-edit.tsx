import { Box, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import useSpecies from "@components/pages/species/show/use-species";
import useTranslation from "@hooks/use-translation";
import CalendarIcon from "@icons/calendar";
import { axUpdateSpeciesTrait } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import Head from "next/head";
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
      valuesString: [value.map((d) => d.toISOString().split("T")[0]).join(":")]
    };

    const { success } = await axUpdateSpeciesTrait(speciesId, traitId, payload);
    if (success) {
      onSave([{ fromDate: value[0], toDate: value[1] }]);
      onClose();
      notification(t("SPECIES.TRAITS.UPDATE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("SPECIES.TRAITS.UPDATE.FAILURE"));
    }
  };

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/flatpickr/dist/themes/material_blue.css"
          key="flatpickr"
        />
      </Head>
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
