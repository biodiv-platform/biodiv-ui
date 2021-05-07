import Activity from "@components/pages/observation/show/activity";
import { axAddSpeciesComment } from "@services/activity.service";
import { RESOURCE_TYPE } from "@static/constants";
import React from "react";

import useSpecies from "../use-species";

export const SpeciesActivity = () => {
  const { species } = useSpecies();

  return (
    <Activity
      resourceId={species.species.id}
      resourceType={RESOURCE_TYPE.SPECIES}
      commentFunc={axAddSpeciesComment}
    />
  );
};
