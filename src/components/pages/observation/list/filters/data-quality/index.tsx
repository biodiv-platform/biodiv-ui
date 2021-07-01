import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";
import { FLAG, IDENTIFICATION, TAXON_ID, VALIDATION } from "./filter-keys";

export default function DataQuality() {
  return (
    <SubAccordion>
      <CheckboxFilterPanel
        translateKey="filters:data_quality.identification."
        filterKey="speciesName"
        options={IDENTIFICATION}
        statKey={"groupIdentificationNameExists"}
      />

      <CheckboxFilterPanel
        translateKey="filters:data_quality.taxon_id."
        filterKey="taxonId"
        options={TAXON_ID}
        statKey={"groupTaxonIDExists"}
      />

      <CheckboxFilterPanel
        translateKey="filters:data_quality.validation."
        filterKey="validate"
        options={VALIDATION}
        statKey={"groupValidate"}
      />

      <CheckboxFilterPanel
        translateKey="filters:data_quality.flag."
        filterKey="isFlagged"
        options={FLAG}
        statKey={"groupFlag"}
      />
    </SubAccordion>
  );
}
