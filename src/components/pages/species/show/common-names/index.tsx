import { Box } from "@chakra-ui/react";
import { ResponsiveContainer } from "@components/@core/table";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpecies from "../use-species";
import SpeciesCommonNames from "./main";

export default function SpeciesCommonNamesContainer() {
  const { t } = useTranslation();
  const { species, permissions } = useSpecies();

  return (
    <ToggleablePanel id="common-names" icon="🗒" title={t("species:common_names")}>
      <Box maxH="300px" w="full" overflow="auto">
        <ResponsiveContainer noBorder={true}>
          <SpeciesCommonNames
            commonNames={species.taxonomicNames.commonNames}
            isContributor={permissions.isContributor}
          />
        </ResponsiveContainer>
      </Box>
    </ToggleablePanel>
  );
}
