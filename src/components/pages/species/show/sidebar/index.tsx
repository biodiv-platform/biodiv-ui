import { GridItem } from "@chakra-ui/layout";
import React from "react";

import SpeciesRelatedObservations from "./related-observations";
import TaxonTable from "./taxon-table";

export default function SpeciesSidebar() {
  return (
    <GridItem colSpan={2}>
      <TaxonTable />
      <SpeciesRelatedObservations />
    </GridItem>
  );
}
