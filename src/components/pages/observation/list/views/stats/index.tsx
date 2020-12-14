import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import SpeciesGroups from "./SpeciesGroups";
import StatesDistribution from "./StatesDistribution";

export default function StatsView() {
  const { observationData, speciesGroup, filter }: any = useObservationFilter();

  return (
    <div>
      <SimpleGrid minChildWidth="120px" spacing="20px">
        <SpeciesGroups
          observationData={observationData}
          speciesGroup={speciesGroup}
          filter={filter}
        />
        <StatesDistribution observationData={observationData} filter={filter} />
      </SimpleGrid>
    </div>
  );
}
