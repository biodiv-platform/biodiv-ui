import { authorizedPageSSR } from "@components/auth/auth-redirect";
import { SpeciesCreatePageComponent } from "@components/pages/species/create";
import { Role } from "@interfaces/custom";
import { axGetTaxonRanks } from "@services/taxonomy.service";
import React from "react";

export default function SpeciesCreatePage({ taxonRanksMeta, name }) {
  return (
    <SpeciesCreatePageComponent taxonRanksMeta={taxonRanksMeta} isSpeciesPage={true} name={name} />
  );
}

SpeciesCreatePage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx, false);

  const { data } = await axGetTaxonRanks();

  return { taxonRanksMeta: data, name: ctx.query.name };
};
