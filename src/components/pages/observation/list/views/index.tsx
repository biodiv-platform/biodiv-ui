import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import GridView from "./grid";
import ListView from "./list";

export default function Views({ no }) {
  const { filter } = useObservationFilter();

  switch (filter?.view) {
    case "list":
      return <ListView no={no} />;

    case "list_minimal":
      return <GridView />;

    case "map":
      return <div>Map</div>;

    default:
      return null;
  }
}
