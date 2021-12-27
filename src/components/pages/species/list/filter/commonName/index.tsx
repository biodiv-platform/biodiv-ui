import {
  CommonNameOption,
  onCommonNameQuery
} from "@components/pages/observation/create/form/recodata/common-name";
import useSpeciesList from "@components/pages/species/list/use-species-list";
import { SPECIES_FILTER_KEY } from "@static/species";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function CommonNameFilter() {
  return (
    <CheckboxFilterPanel
      filterKey={SPECIES_FILTER_KEY.commonName.filterKey}
      filterKeyList={SPECIES_FILTER_KEY}
      useIndexFilter={useSpeciesList}
      translateKey="filters:name.common_name"
      searchQuery={onCommonNameQuery}
      optionsComponent={CommonNameOption}
    />
  );
}
