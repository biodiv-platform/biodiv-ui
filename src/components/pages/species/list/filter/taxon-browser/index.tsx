import TaxonBrowserComponent from "@components/pages/observation/list/filters/taxon-browser/taxon-browser";
import React from "react";

import useSpeciesList from "../../use-species-list";

export default function TaxonBrowser() {
  const { filter, addFilter } = useSpeciesList();

  return (
    <TaxonBrowserComponent
      initialTaxon={filter?.taxon}
      taxonFilterKey={"taxonId"}
      onTaxonChange={addFilter}
    />
  );
}
