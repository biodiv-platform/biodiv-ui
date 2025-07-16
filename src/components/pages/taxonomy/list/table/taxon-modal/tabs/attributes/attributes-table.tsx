import { Box, Heading, HStack, SimpleGrid, Spinner, Table } from "@chakra-ui/react";
import useTaxonFilter from "@components/pages/taxonomy/list/use-taxon";
import { getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { ObservationsLink } from "../../observation";
import { SpeciesPageLink } from "../../species";

export function TaxonAttributesTable() {
  const { modalTaxon, showTaxon } = useTaxonFilter();
  const { t } = useTranslation();

  return modalTaxon ? (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      <Box gridColumn="1/3">
        <Heading as="h3" size="md" mb={4}>
          {t("taxon:modal.data_links.title")}
        </Heading>
        <HStack mb={4} gap={4}>
          <SpeciesPageLink showTaxon={showTaxon} />
          <ObservationsLink showTaxon={showTaxon} />
        </HStack>
        <Heading as="h3" size="md" mb={4}>
          {t("common:information")}
        </Heading>

        <Table.Root borderRadius="lg" striped overflow="hidden">
          <Table.Body>
            <Table.Row>
              <Table.Cell title={t("taxon:modal.attributes.name.desc")} w="12rem">
                {t("taxon:modal.attributes.name.title")}
              </Table.Cell>
              <Table.Cell>
                <span
                  dangerouslySetInnerHTML={{
                    __html: getInjectableHTML(modalTaxon?.italicisedForm)
                  }}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell title={t("taxon:modal.attributes.canonical.desc")}>
                {t("taxon:modal.attributes.canonical.title")}
              </Table.Cell>
              <Table.Cell>{modalTaxon?.canonicalForm}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell title={t("taxon:modal.attributes.author.desc")}>
                {t("taxon:modal.attributes.author.title")}
              </Table.Cell>
              <Table.Cell>{modalTaxon?.authorYear}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell title={t("taxon:modal.attributes.status.desc")}>
                {t("taxon:modal.attributes.status.title")}
              </Table.Cell>
              <Table.Cell>{modalTaxon?.status}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell title={t("taxon:modal.attributes.rank.desc")}>
                {t("taxon:modal.attributes.rank.title")}
              </Table.Cell>
              <Table.Cell>{t(`taxon:hierarchy.${modalTaxon?.rank}`)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell title={t("taxon:modal.attributes.source.desc")}>
                {t("taxon:modal.attributes.source.title")}
              </Table.Cell>
              <Table.Cell>{modalTaxon?.uploaderId}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell title={t("taxon:modal.attributes.via.desc")}>
                {t("taxon:modal.attributes.via.title")}
              </Table.Cell>
              <Table.Cell>{modalTaxon?.viaDatasource}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell title={t("taxon:modal.attributes.id.desc")}>
                {t("taxon:modal.attributes.id.title")}
              </Table.Cell>
              <Table.Cell>{modalTaxon?.matchId}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell title={t("taxon:modal.attributes.position.desc")}>
                {t("taxon:modal.attributes.position.title")}
              </Table.Cell>
              <Table.Cell>{modalTaxon?.position}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Box>
      <Box>
        <Heading as="h3" size="md" mb={4}>
          {t("taxon:modal.attributes.rank.title")}
        </Heading>
        <Table.Root borderRadius="lg" striped overflow="hidden">
          <Table.Body>
            {modalTaxon?.hierarchy?.map((rank) => (
              <Table.Row key={rank.rankName}>
                <Table.Cell>{t(`taxon:hierarchy.${rank.rankName}`)}</Table.Cell>
                <Table.Cell>{rank.name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </SimpleGrid>
  ) : (
    <Spinner />
  );
}
