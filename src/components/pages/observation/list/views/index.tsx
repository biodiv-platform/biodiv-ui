import useObservationFilter from "@hooks/useObservationFilter";
import React from "react";

import GridView from "./grid";
import ListView from "./list";

export default function Views({ no }) {
  const { filter } = useObservationFilter();

  return (
    <>
      {filter.view === "list" && <ListView no={no} />}
      {filter.view === "list_minimal" && <GridView />}
      {filter.view === "map" && <>Map View</>}
    </>
  );
}
