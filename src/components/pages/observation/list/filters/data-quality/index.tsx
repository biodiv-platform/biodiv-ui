import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";
import { FLAG, IDENTIFICATION, TAXON_ID, VALIDATION } from "./filter-keys";

export default function DataQuality() {
  return (
    <SubAccordion>
      <CheckboxFilterPanel
        translateKey="FILTERS.DATA_QUALITY.IDENTIFICATION."
        filterKey="speciesName"
        options={IDENTIFICATION}
        statKey={"groupIdentificationNameExists"}
      />

      <CheckboxFilterPanel
        translateKey="FILTERS.DATA_QUALITY.TAXON_ID."
        filterKey="taxonId"
        options={TAXON_ID}
        statKey={"groupTaxonIDExists"}
      />

      <CheckboxFilterPanel
        translateKey="FILTERS.DATA_QUALITY.VALIDATION."
        filterKey="validate"
        options={VALIDATION}
        statKey={"groupValidate"}
      />

      <CheckboxFilterPanel
        translateKey="FILTERS.DATA_QUALITY.FLAG."
        filterKey="isFlagged"
        options={FLAG}
        statKey={"groupFlag"}
      />
    </SubAccordion>
  );
}
