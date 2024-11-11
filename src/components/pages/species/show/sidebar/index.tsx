import { GridItem } from "@chakra-ui/layout";
import React from "react";

import useSpecies from "../use-species";
import SpeciesRelatedObservations from "./related-observations";
import TaxonTable from "./taxon-table";
import SpeciesTemportalDistribution from "./temporal";
import SpeciesTraitsGraph from "./traits-graph";
import useObservationStatsData from "./use-observation-stats-data";

export default function SpeciesSidebar() {
  const { species } = useSpecies();
  const data = useObservationStatsData(species.species.taxonConceptId);
  return (
    <GridItem colSpan={2}>
      <TaxonTable />
      <SpeciesTemportalDistribution data={data} />
      <SpeciesTraitsGraph data={data} />
      <SpeciesRelatedObservations />
    </GridItem>
  );
}
