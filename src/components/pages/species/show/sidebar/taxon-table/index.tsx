import { Box, Separator, Table } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpecies from "../../use-species";

export default function TaxonTable() {
  const { species } = useSpecies();
  const { t } = useTranslation();

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>🐾 {t("species:taxon")}</BoxHeading>
      <Separator />
      <Box>
        <Table.Root size="sm">
          <Table.Body>
            {species?.breadCrumbs?.map(({ name, rankName, id }) => (
              <Table.Row key={id}>
                <Table.Cell>{t(`taxon:hierarchy.${rankName}`)}</Table.Cell>
                <Table.Cell>
                  <ExternalBlueLink href={`/species/list?taxon=${id}`}>{name}</ExternalBlueLink>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}
