import ObservationLoading from "@components/pages/common/loading";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React, { Suspense } from "react";

import ListView from "./list";

const GridView = React.lazy(() => import("./grid"));
const StatsVew = React.lazy(() => import("./stats"));

export default function Views({ no }) {
  const { filter } = useObservationFilter();

  switch (filter?.view) {
    case "list":
      return <ListView no={no} />;

    case "list_minimal":
      return (
        <Suspense fallback={<ObservationLoading />}>
          <GridView />
        </Suspense>
      );

    case "stats":
      return (
        <Suspense fallback={<ObservationLoading />}>
          <StatsVew />
        </Suspense>
      );

    default:
      return null;
  }
}
