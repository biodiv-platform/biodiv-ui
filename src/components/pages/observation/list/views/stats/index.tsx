import { GridItem, SimpleGrid } from "@chakra-ui/react";
import Loading from "@components/pages/common/loading";
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
import TraitsPerMonth from "./traits-per-month";

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
    groupTraits,
    isLoading
  } = useObservationFilter();

  return isLoading ? (
    <Loading />
  ) : (
    <div>
      {
        <Totals
          filter={filter}
          observationData={observationData}
          speciesGroup={speciesGroup}
          totalCounts={totalCounts}
          isLoading={totalCounts==null}
        />
      }
      <SimpleGrid columns={{ md: 2 }} spacing={4} mb={4}>
        {topUploaders?.length && topUploaders?.length > 0 && <TopUploaders filter={filter} topUploaders={topUploaders} isLoading={isLoading} />}
        <TopIdentifiers filter={filter} topIdentifiers={topIdentifiers} />
        {
          <GridItem colSpan={2}>
            <TaxanomicDistribution data={taxon} isLoading={taxon==null || Object.keys(taxon).length == 0} />
          </GridItem>
        }
        {totalCounts && (
          <SpeciesGroups
            observationData={observationData}
            speciesGroup={speciesGroup}
            filter={filter}
          />
        )}
        {uniqueSpecies && Object.entries(uniqueSpecies)?.length  && Object.entries(uniqueSpecies)?.length>0 && <LifeList filter={filter} uniqueSpecies={uniqueSpecies} />}
      </SimpleGrid>
      {isLoading && <ObservationsMap />}
      {isLoading && <StatesDistribution observationData={observationData} filter={filter} />}
      <ObservationPerDay data={countPerDay} isLoading={isLoading} />
      <TemporalObservedOn data={groupObservedOn} isLoading={isLoading} />
      <TraitsPerMonth data={groupTraits} isLoading={isLoading} />
    </div>
  );
}
