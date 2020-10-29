import React from "react";
import useUserData from "../../use-user-data";

import LifeList from "./life-list";
import ObservationListTab from "./observation-list";
import SpeciesGroupChart from "./species-group-chart";

export default function ObservationTab({ userId }) {
  const ud = useUserData(userId);

  return (
    <div>
      <LifeList userId={userId} />
      <ObservationListTab ud={ud} />
      <SpeciesGroupChart data={ud.speciesData} />
    </div>
  );
}
