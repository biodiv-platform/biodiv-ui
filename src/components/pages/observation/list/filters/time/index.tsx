import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import DateRangeFilter from "../shared/date-range";
import SubAccordion from "../shared/sub-accordion";
import { MONTHS } from "./filter-keys";

export default function TimeFilter() {
  return (
    <SubAccordion>
      <CheckboxFilterPanel
        translateKey="FILTERS.TIME.MONTH."
        filterKey="month"
        options={MONTHS}
        statKey="groupMonth"
      />

      <DateRangeFilter
        translateKey="FILTERS.TIME.OBSERVED_ON"
        filterKey={{ min: "minDate", max: "maxDate" }}
      />

      <DateRangeFilter
        translateKey="FILTERS.TIME.CREATED_ON"
        filterKey={{ min: "createdOnMinDate", max: "createdOnMaxDate" }}
      />
    </SubAccordion>
  );
}
