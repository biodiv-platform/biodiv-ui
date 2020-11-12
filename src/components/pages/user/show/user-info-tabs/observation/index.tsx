import { SimpleGrid } from "@chakra-ui/core";
import React from "react";

import useUserData from "../../use-user-data";
import LifeList from "./life-list";
import ObservationListTab from "./observation-list";
import SpeciesGroupChart from "./species-group-chart";
import SpeciesGroupFilter from "./species-group-filter";
import UserObservationsMap from "./user-observations-map";

export default function ObservationTab({ userId }) {
  const ud = useUserData(userId);

  return (
    <div>
      <SpeciesGroupFilter
        speciesGroups={ud.speciesGroups}
        filter={ud.filter}
        setFilter={ud.setFilter}
      />
      <LifeList userId={userId} filter={ud.filter} />
      <ObservationListTab ud={ud} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <UserObservationsMap userId={userId} />
        <SpeciesGroupChart data={ud.speciesData} />
      </SimpleGrid>
    </div>
  );
}
