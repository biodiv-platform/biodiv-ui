import React from "react";

import TaxonBrowserComponent from "./taxon-browser";
import useObservationFilter from "@hooks/useObservationFilter";

export default function TaxonBrowser() {
  const { filter, addFilter } = useObservationFilter();

  return <TaxonBrowserComponent initialTaxon={filter.taxon} onTaxonChange={addFilter} />;
}
