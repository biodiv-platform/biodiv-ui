import useSpeciesList from "@components/pages/species/list/use-species-list";
import { SPECIES_FILTER_KEY } from "@static/species";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function ScientificNameFilter() {
  return (
    <CheckboxFilterPanel
      filterKey={SPECIES_FILTER_KEY.scientificName.filterKey}
      filterKeyList={SPECIES_FILTER_KEY}
      useIndexFilter={useSpeciesList}
      translateKey="filters:user.username"
    />
  );
}
