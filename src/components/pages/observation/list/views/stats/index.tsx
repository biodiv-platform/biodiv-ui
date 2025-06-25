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
import TraitsPerMonth from "./traits-per-month";
import useObservationData from "./use-observation-data";

export default function StatsView() {
  const { observationData, filter } = useObservationFilter();
  const stats = useObservationData({ filter });
  const data = stats.data.list;
  const isLoading = stats.data.isLoading;

  return (
    <div>
      <Totals filter={filter} observationData={observationData} />
      <SimpleGrid columns={{ md: 2 }} spacing={4} mb={4}>
        <TopUploaders filter={filter} />
        <TopIdentifiers filter={filter} />
        <GridItem colSpan={2}>
          <TaxanomicDistribution data={data.groupTaxon} isLoading={isLoading} />
        </GridItem>
        <SpeciesGroups
          observationData={observationData}
          filter={filter}
        />
        <LifeList filter={filter} />
      </SimpleGrid>
      <ObservationsMap />
      <StatesDistribution observationData={observationData} filter={filter} />
      <ObservationPerDay data={data.countPerDay} isLoading={isLoading} />
      <TemporalObservedOn data={data.groupObservedOn} isLoading={isLoading} />
      <TraitsPerMonth data={data.groupTraits} isLoading={isLoading} />
    </div>
  );
}
