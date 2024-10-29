import TraitsPerMonth from "@components/pages/observation/list/views/stats/traits-per-month";
import React from "react";

import useSpecies from "../../use-species";
import useTraitsData from "./use-traits-data";

export default function SpeciesTraitsGraph() {
  const { species } = useSpecies();
  const data = useTraitsData(species.species.taxonConceptId);

  return <TraitsPerMonth data={data.data.list.groupTraits} isLoading={data.data.isLoading} />;
}
