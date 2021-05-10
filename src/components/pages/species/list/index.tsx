import React from "react";

import Header from "./header";
import ListTiles from "./list-tiles";
import { SpeciesListProvider } from "./use-observation-list";

export default function SpeciesListPageComponent() {
  return (
    <SpeciesListProvider>
      <div className="container mt">
        <Header />
        <ListTiles />
      </div>
    </SpeciesListProvider>
  );
}
