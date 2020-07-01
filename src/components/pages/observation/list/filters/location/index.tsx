import useObservationFilter from "@hooks/useObservationFilter";
import React from "react";

import SubAccordion from "../shared/sub-accordion";
import FilterMultiSelectPanel from "./location-multi-select";
import MapAreaFilter from "./map-area";

export default function LocationFilter() {
  const { states } = useObservationFilter();

  return (
    <SubAccordion>
      <MapAreaFilter />

      <FilterMultiSelectPanel
        filterKey="state"
        translateKey="FILTERS.LOCATION.STATE"
        options={states}
      />

      <FilterMultiSelectPanel filterKey="district" translateKey="FILTERS.LOCATION.DISTRICT" />

      <FilterMultiSelectPanel filterKey="tahsil" translateKey="FILTERS.LOCATION.TAHSIL" />
    </SubAccordion>
  );
}
