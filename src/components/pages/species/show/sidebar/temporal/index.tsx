import Temporal from "@components/pages/observation/show/sidebar/temporal";
import React from "react";

import useSpecies from "../../use-species";

export default function SpeciesTemportalDistribution() {
  const { species } = useSpecies();
  return <Temporal data={species.temporalData} />;
}
