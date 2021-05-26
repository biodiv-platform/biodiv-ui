import { Box } from "@chakra-ui/layout";
import { Td, Tr } from "@chakra-ui/react";
import { Table, Tbody } from "@chakra-ui/table";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@hooks/use-translation";
import React from "react";

import useSpecies from "../../use-species";

export default function TaxonTable() {
  const { species } = useSpecies();
  const { t } = useTranslation();

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>🐾 {t("SPECIES.TAXON")}</BoxHeading>
      <Box>
        <Table size="sm">
          <Tbody>
            {species?.breadCrumbs?.map(({ name, rankName, id }) => (
              <Tr key={id}>
                <Td textTransform="capitalize">{rankName}</Td>
                <Td>
                  <ExternalBlueLink href={`/species/list?taxon=${id}`}>{name}</ExternalBlueLink>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
