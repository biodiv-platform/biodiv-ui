import { Box } from "@chakra-ui/react";
import { ResponsiveContainer } from "@components/@core/table";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { axDeleteSpeciesCommonName, axUpdateSpeciesCommonName } from "@services/species.service";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpecies from "../use-species";
import CommonNamesList from "./main";

export default function SpeciesCommonNamesContainer() {
  const { t } = useTranslation();
  const { species, permissions } = useSpecies();

  return (
    <ToggleablePanel id="common-names" icon="🗒" title={t("species:common_names")}>
      <Box w="full">
        <ResponsiveContainer maxH="300px" noBorder={true}>
          <CommonNamesList
            commonNames={species.taxonomicNames.commonNames}
            isContributor={permissions.isContributor}
            speciesId={species.species.id}
            taxonId={species.species.taxonConceptId}
            updateFunc={axUpdateSpeciesCommonName}
            deleteFunc={axDeleteSpeciesCommonName}
          />
        </ResponsiveContainer>
      </Box>
    </ToggleablePanel>
  );
}
