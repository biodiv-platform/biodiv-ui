import { SPECIES_FILTER_KEY } from "@static/species";
import React from "react";

import useSpeciesList from "../../use-species-list";
import CheckboxFilterPanel from "../shared/multi-select-search";

export default function AttributeFilter() {
  return (
    <CheckboxFilterPanel
      filterKeyList={SPECIES_FILTER_KEY}
      filterKey={SPECIES_FILTER_KEY.attributes.filterKey}
      useIndexFilter={useSpeciesList}
      translateKey="filters:attribution.title"
    />
  );
}
