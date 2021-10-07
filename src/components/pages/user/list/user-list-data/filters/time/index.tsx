import React from "react";

import DateRangeFilter from "../shared/date-range";
import SubAccordion from "../shared/sub-accordion";

export default function TimeFilter() {
  return (
    <SubAccordion>
      <DateRangeFilter
        translateKey="filters:time.last_logged"
        filterKey={{ min: "lastLoggedInMinDate", max: "lastLoggedInMaxDate" }}
      />

      <DateRangeFilter
        translateKey="filters:time.created_on"
        filterKey={{ min: "createdOnMinDate", max: "createdOnMaxDate" }}
      />
    </SubAccordion>
  );
}
