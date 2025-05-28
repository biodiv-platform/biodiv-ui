import { GridItem, SimpleGrid } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import ObservationsMap from "../map";
import LifeList from "./life-list";
import ObservationPerDay from "./observation-per-day";
import SpeciesGroups from "./species-groups";
import StatesDistribution from "./states-distribution";
import TaxanomicDistribution from "./taxanomic-distribution";
import TemporalObservedOn from "./temporal-observed-on";
import TopIdentifiers from "./top-identifiers";
import TopUploaders from "./top-uploaders";
import Totals from "./totals";

export default function StatsView() {
  const {
    observationData,
    speciesGroup,
    filter,
    totalCounts,
    topUploaders,
    topIdentifiers,
    uniqueSpecies,
    taxon,
    countPerDay,
    groupObservedOn,
    isLoading
  } = useObservationFilter();
  /*const stats = useObservationData({ filter });
  const data = stats.data.list;
  const isLoading = stats.data.isLoading;*/

  return (
    <div>
      <Totals
        filter={filter}
        observationData={observationData}
        speciesGroup={speciesGroup}
        totalCounts={totalCounts}
        isLoading={isLoading}
      />
      <SimpleGrid columns={{ md: 2 }} spacing={4} mb={4}>
        <TopUploaders filter={filter} topUploaders={topUploaders} isLoading={isLoading} />
        <TopIdentifiers filter={filter} topIdentifiers={topIdentifiers} />
        <GridItem colSpan={2}>
          <TaxanomicDistribution data={taxon} isLoading={isLoading} />
        </GridItem>
        <SpeciesGroups
          observationData={observationData}
          speciesGroup={speciesGroup}
          filter={filter}
        />
        <LifeList filter={filter} uniqueSpecies={uniqueSpecies} />
      </SimpleGrid>
      <ObservationsMap />
      <StatesDistribution observationData={observationData} filter={filter} />
      <ObservationPerDay data={countPerDay} isLoading={isLoading} />
      <TemporalObservedOn data={groupObservedOn} isLoading={isLoading} />
      {/*<TraitsPerMonth data={data.groupTraits} isLoading={isLoading} />*/}
    </div>
  );
}
