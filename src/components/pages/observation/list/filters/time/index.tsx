import { Accordion } from "@chakra-ui/core";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import DateRangeFilter from "../shared/date-range";
import { MONTHS } from "./filter-keys";

export default function TimeFilter() {
  return (
    <Accordion
      borderX="1px solid"
      borderColor="gray.200"
      m={1}
      borderRadius="lg"
      overflow="hidden"
      allowMultiple={true}
    >
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
    </Accordion>
  );
}
