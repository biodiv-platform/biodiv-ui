import { SimpleGrid } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import SpeciesGroups from "./species-groups";
import StatesDistribution from "./states-distribution";

export default function StatsView() {
  const { observationData, speciesGroup, filter } = useObservationFilter();

  return (
    <SimpleGrid columns={{ md: 2 }} spacing={4} mb={4}>
      <SpeciesGroups
        observationData={observationData}
        speciesGroup={speciesGroup}
        filter={filter}
      />
      <StatesDistribution observationData={observationData} filter={filter} />
    </SimpleGrid>
  );
}
