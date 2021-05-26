import { Box, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { ResponsiveContainer } from "@components/@core/table";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import useTranslation from "@hooks/use-translation";
import React, { useState } from "react";

import useSpecies from "../use-species";
import { SynonymAdd, SynonymEditButtons } from "./actions";
import SynonymEditModal from "./edit-modal";

export default function SpeciesSynonym() {
  const { t } = useTranslation();
  const { species, permissions } = useSpecies();

  const [synonymsList, setSynonymsList] = useState(species.taxonomicNames.synonyms);

  return (
    <ToggleablePanel id="synonyms" icon="🗒" title={t("SPECIES.SYNONYMS")}>
      <SynonymEditModal onUpdate={setSynonymsList} />
      <Box maxH="300px">
        <ResponsiveContainer noBorder={true}>
          <Table size="sm" variant="striped">
            <Tbody>
              {synonymsList.length ? (
                synonymsList.map((synonym) => (
                  <Tr key={synonym.id}>
                    <Td w={{ md: "10rem" }} verticalAlign="top">
                      {synonym.status.toLowerCase()}
                    </Td>
                    <Td>
                      {permissions.isContributor ? (
                        <SynonymEditButtons synonym={synonym} />
                      ) : (
                        synonym.normalizedForm
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td>{t("NO_DATA")}</Td>
                </Tr>
              )}
              {permissions.isContributor && <SynonymAdd />}
            </Tbody>
          </Table>
        </ResponsiveContainer>
      </Box>
    </ToggleablePanel>
  );
}
