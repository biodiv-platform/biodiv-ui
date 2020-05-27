import { Accordion } from "@chakra-ui/core";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";
import { FLAG, IDENTIFICATION, VALIDATION, TAXON_ID } from "./filter-keys";

export default function DataQuality() {
  return (
    <Accordion
      borderX="1px solid"
      borderColor="gray.200"
      m={1}
      defaultIndex={[0]}
      borderRadius="lg"
      overflow="hidden"
      allowMultiple={true}
    >
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
    </Accordion>
  );
}
