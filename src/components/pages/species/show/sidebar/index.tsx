import { GridItem } from "@chakra-ui/react";
import TemporalObservedOn from "@components/pages/observation/list/views/stats/temporal-observed-on";
import TraitsPerMonth from "@components/pages/observation/list/views/stats/traits-per-month";
import useGlobalState from "@hooks/use-global-state";
import React from "react";

import useSpecies from "../use-species";
import SpeciesRelatedObservations from "./related-observations";
import TaxonTable from "./taxon-table";

export default function SpeciesSidebar({ temporalObservedRef, traitsPerMonthRef }) {
  const { currentGroup } = useGlobalState();
  const { species } = useSpecies();
  return (
    <GridItem colSpan={2}>
      <TaxonTable />
      <TemporalObservedOn
        ref={temporalObservedRef}
        filter={{
          view: "stats",
          max: 8,
          offset: 0,
          userGroupList: currentGroup?.id || undefined,
          taxon: String(species.species.taxonConceptId),
          showData: "true"
        }}
      />
      <TraitsPerMonth
        ref={traitsPerMonthRef}
        filter={{
          view: "stats",
          max: 8,
          offset: 0,
          userGroupList: currentGroup?.id || undefined,
          taxon: String(species.species.taxonConceptId),
          showData: "true"
        }}
      />
      <SpeciesRelatedObservations />
    </GridItem>
  );
}
