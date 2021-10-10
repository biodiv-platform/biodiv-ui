import LocalLink from "@components/@core/local-link";
import useTaxonFilter from "@components/pages/taxonomy/list/use-taxon";
import React from "react";

import { useSpeciesId } from "./use-species-id";

export function SpeciesPageLinkTab({showTaxon}) {
  const speciesId = useSpeciesId(showTaxon);
  return speciesId && <LocalLink href={`/species/show/${speciesId}`}>Species</LocalLink>;
}
