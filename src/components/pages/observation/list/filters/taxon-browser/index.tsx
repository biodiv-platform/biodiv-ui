import React from "react";

import TaxonBrowserComponent from "./taxon-browser";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";

export default function TaxonBrowser() {
  const { filter, addFilter } = useObservationFilter();

  return <TaxonBrowserComponent initialTaxon={filter.taxon} onTaxonChange={addFilter} />;
}
