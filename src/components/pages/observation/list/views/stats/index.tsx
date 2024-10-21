import { SimpleGrid } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import ObservationsMap from "../map";
import LifeList from "./life-list";
import ObservationPerDay from "./observation-per-day";
import SpeciesGroups from "./species-groups";
import StatesDistribution from "./states-distribution";
import TemporalObservedOn from "./temporal-observed-on";
import TopIdentifiers from "./top-identifiers";
import TopUploaders from "./top-uploaders";
import Totals from "./totals";

export default function StatsView() {
  const { observationData, speciesGroup, filter } = useObservationFilter();

  return (
    <div>
      <Totals filter={filter} observationData={observationData} speciesGroup={speciesGroup} />
      <SimpleGrid columns={{ md: 2 }} spacing={4} mb={4}>
        <TopUploaders filter={filter} />
        <TopIdentifiers filter={filter} />
        <SpeciesGroups
          observationData={observationData}
          speciesGroup={speciesGroup}
          filter={filter}
        />
        <LifeList filter={filter} />
      </SimpleGrid>

      <ObservationsMap />

      <SimpleGrid columns={{ md: 1 }} spacing={4} mb={4}>
        <StatesDistribution observationData={observationData} filter={filter} />
        <ObservationPerDay filter={filter} />
        <TemporalObservedOn filter={filter} />
      </SimpleGrid>
    </div>
  );
}
