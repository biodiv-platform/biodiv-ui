import { Box } from "@chakra-ui/react";
import CommonNamesList from "@components/pages/species/show/common-names/main";
import useTaxonFilter from "@components/pages/taxonomy/list/use-taxon";
import { Role } from "@interfaces/custom";
import { axDeleteTaxonCommonName, axUpdateTaxonCommonName } from "@services/taxonomy.service";
import { hasAccess } from "@utils/auth";
import React, { useState } from "react";

import Loading from "@/components/pages/common/loading";

export function TaxonCommonNamesTab() {
  const { modalTaxon } = useTaxonFilter();
  const [loading, setLoading] = useState(false)

  return (
    loading?
    <Loading/>
    :
    <Box pt={4}>
      {modalTaxon?.id && (
        <CommonNamesList
          commonNames={modalTaxon?.commonNames || []}
          taxonId={modalTaxon.id}
          isContributor={hasAccess([Role.Admin])}
          updateFunc={axUpdateTaxonCommonName}
          deleteFunc={axDeleteTaxonCommonName}
          setLoading={setLoading}
        />
      )}
    </Box>
  );
}
