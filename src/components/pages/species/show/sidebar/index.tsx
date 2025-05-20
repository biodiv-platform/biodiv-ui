import { GridItem } from "@chakra-ui/layout";
import React from "react";

import useSpecies from "../use-species";
import SpeciesRelatedObservations from "./related-observations";
import TaxonTable from "./taxon-table";
import SpeciesTemportalDistribution from "./temporal";
import SpeciesTraitsGraph from "./traits-graph";

export default function SpeciesSidebar() {
  useSpecies();
  const data = {
    data: {
      list: {
        groupTraits: [],
        groupObservedOn: {}
      },
      isLoading: false
    }
  };
  return (
    <GridItem colSpan={2}>
      <TaxonTable />
      <SpeciesTemportalDistribution data={data} />
      <SpeciesTraitsGraph data={data} />
      <SpeciesRelatedObservations />
    </GridItem>
  );
}
