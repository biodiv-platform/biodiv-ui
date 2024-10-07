import { SimpleGrid } from "@chakra-ui/react";
import React from "react";

import useUserData from "../../use-user-data";
import LifeList from "./life-list";
import ObservationListTab from "./observation-list";
import SpeciesGroupChart from "./species-group-chart";
import SpeciesGroupFilter from "./species-group-filter";
import TemporalDistribution from "./temporal-distribution";
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
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <UserObservationsMap userId={userId} groupId={ud.filter.sGroupId} />
        <SpeciesGroupChart data={ud.speciesData} />
      </SimpleGrid>
      <ObservationListTab ud={ud} />
      <LifeList userId={userId} filter={ud.filter} />
      <TemporalDistribution userId = {userId}/>
    </div>
  );
}
