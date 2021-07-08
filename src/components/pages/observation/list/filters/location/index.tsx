import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import SITE_CONFIG from "@configs/site-config";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import FilterMultiSelectPanel from "../shared/location-multi-select";
import SubAccordion from "../shared/sub-accordion";
import MapAreaFilter from "./map-area";

export default function LocationFilter() {
  const { states } = useObservationFilter();
  const STATE_OPTIONS = states?.map((state) => ({ label: state, value: state, stat: state }));

  return (
    <SubAccordion>
      <MapAreaFilter />

      {SITE_CONFIG.FILTER.STATE && (
        <CheckboxFilterPanel
          translateKey="filters:location.state."
          filterKey="state"
          options={STATE_OPTIONS}
          statKey="groupState"
          skipOptionsTranslation={true}
          showSearch={true}
        />
      )}

      {SITE_CONFIG.FILTER.DISTRICT && (
        <FilterMultiSelectPanel filterKey="district" translateKey="filters:location.district" />
      )}

      {SITE_CONFIG.FILTER.TAHSIL && (
        <FilterMultiSelectPanel filterKey="tahsil" translateKey="filters:location.tehsil" />
      )}
    </SubAccordion>
  );
}
