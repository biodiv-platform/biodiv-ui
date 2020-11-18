import React from "react";

import DateRangeFilter from "../shared/date-range";
import SubAccordion from "../shared/sub-accordion";

export default function TimeFilter() {
  return (
    <SubAccordion>
      <DateRangeFilter
        translateKey="FILTERS.TIME.OBSERVED_ON"
        filterKey={{ min: "revisedOnMinDate", max: "revisedOnMaxDate" }}
      />

      <DateRangeFilter
        translateKey="FILTERS.TIME.CREATED_ON"
        filterKey={{ min: "createdOnMinDate", max: "createdOnMaxDate" }}
      />
    </SubAccordion>
  );
}
