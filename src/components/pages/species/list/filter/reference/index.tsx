import { SPECIES_FILTER_KEY } from "@static/species";
import React from "react";

import useSpeciesList from "../../use-species-list";
import CheckboxFilterPanel from "../shared/multi-select-search";

export default function ReferenceFilter() {
  return (
    <CheckboxFilterPanel
      filterKeyList={SPECIES_FILTER_KEY}
      filterKey={SPECIES_FILTER_KEY.reference.filterKey}
      useIndexFilter={useSpeciesList}
      translateKey="filters:reference.title"
    />
  );
}
