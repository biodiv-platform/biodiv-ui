import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { OBSERVATION_FILTER_KEY } from "@static/observation-list";
import React from "react";

import CheckboxFilterPanel from "../shared/multi-select-search";

export default function TagFilter() {
  return (
    <CheckboxFilterPanel
      filterKeyList={OBSERVATION_FILTER_KEY}
      useIndexFilter={useObservationFilter}
      filterKey={OBSERVATION_FILTER_KEY.tags.filterKey}
      translateKey="form:tags"
    />
  );
}
