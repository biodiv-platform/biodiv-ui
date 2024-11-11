import TemporalObservedOn from "@components/pages/observation/list/views/stats/temporal-observed-on";
import React from "react";

export default function SpeciesTemportalDistribution({ data }) {
  return (
    <TemporalObservedOn data={data.data.list.groupObservedOn} isLoading={data.data.isLoading} />
  );
}
