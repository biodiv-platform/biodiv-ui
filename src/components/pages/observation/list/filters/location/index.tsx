import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import SubAccordion from "../shared/sub-accordion";
import FilterMultiSelectPanel from "./location-multi-select";
import MapAreaFilter from "./map-area";
import CheckboxFilterPanel from "../shared/checkbox";

export default function LocationFilter() {
  const { states } = useObservationFilter();
  const STATE_OPTIONS = states?.map((state) => ({ label: state, value: state, stat: state }));

  return (
    <SubAccordion>
      <MapAreaFilter />

      <CheckboxFilterPanel
        translateKey="FILTERS.LOCATION.STATE."
        filterKey="state"
        options={STATE_OPTIONS}
        statKey="groupState"
        skipOptionsTranslation={true}
        showSearch={true}
      />

      <FilterMultiSelectPanel filterKey="district" translateKey="FILTERS.LOCATION.DISTRICT" />

      <FilterMultiSelectPanel filterKey="tahsil" translateKey="FILTERS.LOCATION.TAHSIL" />
    </SubAccordion>
  );
}
