import TraitsPerMonth from "@components/pages/observation/list/views/stats/traits-per-month";
import React from "react";

export default function SpeciesTraitsGraph({ data }) {
  return <TraitsPerMonth data={data.data.list.groupTraits} isLoading={data.data.isLoading} />;
}
