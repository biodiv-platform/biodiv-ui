import { GridItem } from "@chakra-ui/layout";
import React from "react";

import useSpecies from "../use-species";
import SpeciesRelatedObservations from "./related-observations";
import TaxonTable from "./taxon-table";
import SpeciesTraitsGraph from "./traits-graph";
import useObservationStatsData from "./use-observation-stats-data";

export default function SpeciesSidebar() {
  const { species } = useSpecies();
  let data = {
    data: {
      list: {
        groupTraits: [],
        groupObservedOn: {}
      },
      isLoading: false
    }
  };
  if (species.species.taxonConceptId != null && species.species.taxonConceptId != undefined) {
    data = useObservationStatsData(species.species.taxonConceptId);
  }
  return (
    <GridItem colSpan={2}>
      <TaxonTable />
      <SpeciesTraitsGraph data={data} />
      <SpeciesRelatedObservations />
    </GridItem>
  );
}
