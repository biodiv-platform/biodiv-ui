import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import DateRangeFilter from "../shared/date-range";
import SubAccordion from "../shared/sub-accordion";
import { MONTHS } from "./filter-keys";

export default function TimeFilter() {
  return (
    <SubAccordion>
      <CheckboxFilterPanel
        translateKey="filters:time.month."
        filterKey="months"
        options={MONTHS}
        statKey="groupMonth"
      />

      <DateRangeFilter
        translateKey="common:observed_on"
        filterKey={{ min: "minDate", max: "maxDate" }}
      />

      <DateRangeFilter
        translateKey="filters:time.created_on"
        filterKey={{ min: "createdOnMinDate", max: "createdOnMaxDate" }}
      />
    </SubAccordion>
  );
}
