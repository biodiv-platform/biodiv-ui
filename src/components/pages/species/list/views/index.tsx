import React from "react";

import useSpeciesList from "../use-species-list";
import GridView from "./list-tiles";
import ListView from "./table";

export default function Views() {
  const {
    filter: { f }
  } = useSpeciesList();

  switch (f?.view) {
    case "grid":
      return <GridView />;

    default:
      return <ListView />;
  }
}
