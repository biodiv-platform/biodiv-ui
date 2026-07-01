import TaxonBrowserComponent from "@components/pages/observation/list/filters/taxon-browser/taxon-browser";
import React from "react";

import useDocumentFilter from "../../../common/use-document-filter";

export default function TaxonBrowser() {
  const { filter, addFilter } = useDocumentFilter();

  return (
    <TaxonBrowserComponent
      initialTaxon={filter?.taxon}
      taxonFilterKey={"taxon"}
      onTaxonChange={addFilter}
    />
  );
}
