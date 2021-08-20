import { Box } from "@chakra-ui/react";
import Activity from "@components/pages/observation/show/activity";
import useTaxonFilter from "@components/pages/taxonomy/list/use-taxon";
import { axAddTaxonomyComment } from "@services/taxonomy.service";
import { RESOURCE_TYPE } from "@static/constants";
import React from "react";

export function TaxonActivityTab() {
  const { modalTaxon } = useTaxonFilter();

  return (
    <Box pt={4}>
      {modalTaxon?.id && (
        <Activity
          resourceId={modalTaxon.id}
          resourceType={RESOURCE_TYPE.TAXONOMY}
          commentFunc={axAddTaxonomyComment}
        />
      )}
    </Box>
  );
}
