import { Box, Checkbox } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpeciesCreate from "./species-taxon-suggestions/create/use-species-create";

export function CreateSpeciesPageCheck() {
  const { t } = useTranslation();
  const { isCreateSpecies, setIsCreateSpecies, isSpeciesPage } = useSpeciesCreate();

  return isSpeciesPage ? null : (
    <Box mb={4}>
      <Checkbox
        defaultChecked={isCreateSpecies}
        onChange={(e) => setIsCreateSpecies(e.target.checked)}
      >
        {t("species:create.create_species_page")}
      </Checkbox>
    </Box>
  );
}
