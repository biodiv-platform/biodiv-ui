import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";
import { FLAG } from "./filter-keys";

export default function DataQuality() {
  return (
    <SubAccordion>
      <CheckboxFilterPanel
        translateKey="FILTERS.DATA_QUALITY.FLAG."
        filterKey="isFlagged"
        options={FLAG}
        statKey={"groupFlag"}
      />
    </SubAccordion>
  );
}
