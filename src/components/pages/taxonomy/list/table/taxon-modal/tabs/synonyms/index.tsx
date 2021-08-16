import { Box } from "@chakra-ui/react";
import SynonymList from "@components/pages/species/show/synonyms/main";
import useTaxonFilter from "@components/pages/taxonomy/list/use-taxon";
import { Role } from "@interfaces/custom";
import { axDeleteTaxonSynonym, axUpdateTaxonSynonym } from "@services/taxonomy.service";
import { hasAccess } from "@utils/auth";
import React from "react";

export function TaxonSynonymsTab() {
  const { modalTaxon } = useTaxonFilter();

  return (
    <Box pt={4}>
      {modalTaxon?.id && (
        <SynonymList
          isContributor={hasAccess([Role.Admin])}
          synonyms={modalTaxon?.synonymNames}
          taxonId={modalTaxon.id}
          updateFunc={axUpdateTaxonSynonym}
          deleteFunc={axDeleteTaxonSynonym}
        />
      )}
    </Box>
  );
}
