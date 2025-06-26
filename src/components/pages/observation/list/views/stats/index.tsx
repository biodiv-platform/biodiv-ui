import { GridItem, SimpleGrid } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import ObservationsMap from "../map";
import LazyLoadOnScroll from "./lazy-load-on-scroll";
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
  const { observationData, filter } = useObservationFilter();

  return (
    <div>
      <LazyLoadOnScroll>
        <Totals filter={filter} observationData={observationData} />
      </LazyLoadOnScroll>
      <SimpleGrid columns={{ md: 2 }} spacing={4} mb={4}>
        <LazyLoadOnScroll>
          <TopUploaders filter={filter} />
        </LazyLoadOnScroll>
        <LazyLoadOnScroll>
          <TopIdentifiers filter={filter} />
        </LazyLoadOnScroll>
        <GridItem colSpan={2}>
          <LazyLoadOnScroll>
            <TaxanomicDistribution filter={filter} />
          </LazyLoadOnScroll>
        </GridItem>
        <SpeciesGroups
          observationData={observationData}
          filter={filter}
        />
        <LazyLoadOnScroll>
          <LifeList filter={filter} />
        </LazyLoadOnScroll>
      </SimpleGrid>
      <ObservationsMap />
      <StatesDistribution observationData={observationData} filter={filter} />
      <LazyLoadOnScroll>
        <ObservationPerDay filter={filter} />
      </LazyLoadOnScroll>
      <LazyLoadOnScroll>
        <TemporalObservedOn filter={filter} />
      </LazyLoadOnScroll>
      <LazyLoadOnScroll>
        <TraitsPerMonth filter={filter} />
      </LazyLoadOnScroll>
    </div>
  );
}
