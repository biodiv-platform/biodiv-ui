import { GridItem } from "@chakra-ui/layout";
import React from "react";

import SpeciesRelatedObservations from "./related-observations";
import TaxonTable from "./taxon-table";
import SpeciesTemportalDistribution from "./temporal";
import SpeciesTraitsGraph from "./traits-graph";

export default function SpeciesSidebar() {
  return (
    <GridItem colSpan={2}>
      <TaxonTable />
      <SpeciesTemportalDistribution />
      <SpeciesRelatedObservations />
      <SpeciesTraitsGraph />
    </GridItem>
  );
}
