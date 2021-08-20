import TaxonListComponent from "@components/pages/taxonomy/list";
import { TaxonFilterProvider } from "@components/pages/taxonomy/list/use-taxon";
import { axGetTaxonRanks } from "@services/taxonomy.service";
import { DEFAULT_FILTER } from "@static/taxon";
import React from "react";

function TaxonListPage(props) {
  return (
    <TaxonFilterProvider {...props}>
      <TaxonListComponent />
    </TaxonFilterProvider>
  );
}

TaxonListPage.getInitialProps = async (ctx) => {
  const { data: taxonRanks } = await axGetTaxonRanks();

  return {
    taxonRanks: taxonRanks.map((r) => ({ ...r, value: r.name })),
    filter: {
      ...DEFAULT_FILTER,
      ...ctx.query
    }
  };
};

TaxonListPage.config = {
  footer: false
};

export default TaxonListPage;
