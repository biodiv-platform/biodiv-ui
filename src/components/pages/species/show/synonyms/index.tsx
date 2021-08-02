import { Box } from "@chakra-ui/react";
import { ResponsiveContainer } from "@components/@core/table";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpecies from "../use-species";
import SpeciesSynonym from "./main";

export default function SpeciesSynonymsContainer() {
  const { t } = useTranslation();
  const { species, permissions } = useSpecies();

  return (
    <ToggleablePanel id="synonyms" icon="🗒" title={t("species:synonyms")}>
      <Box maxH="300px">
        <ResponsiveContainer noBorder={true}>
          <SpeciesSynonym
            synonyms={species.taxonomicNames.synonyms}
            isContributor={permissions.isContributor}
          />
        </ResponsiveContainer>
      </Box>
    </ToggleablePanel>
  );
}
