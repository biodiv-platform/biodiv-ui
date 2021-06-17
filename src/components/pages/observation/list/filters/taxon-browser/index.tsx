import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";

import TaxonBrowserComponent from "./taxon-browser";

export default function TaxonBrowser() {
  const { filter, addFilter } = useObservationFilter();

  return <TaxonBrowserComponent initialTaxon={filter?.taxon} onTaxonChange={addFilter} />;
}
