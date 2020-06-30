import { Accordion } from "@chakra-ui/core";
import useObservationFilter from "@hooks/useObservationFilter";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function TraitsFilter() {
  const { traits } = useObservationFilter();

  return traits.length ? (
    <Accordion
      allowMultiple={true}
      borderColor="gray.200"
      borderRadius="lg"
      borderX="1px solid"
      m={1}
      overflow="hidden"
    >
      {traits.map((trait) => (
        <CheckboxFilterPanel
          label={trait.name}
          filterKey={`trait_${trait.id}.string`}
          options={trait.traitValues}
          statKey={`groupTraits.${trait.name}`}
          skipOptionsTranslation={true}
        />
      ))}
    </Accordion>
  ) : null;
}
