import { Box, Heading, HStack, SimpleGrid, Spinner, Table, Tbody, Td, Tr } from "@chakra-ui/react";
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
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <Box gridColumn="1/3">
        <Heading as="h3" size="md" mb={4}>
          {t("taxon:modal.data_links.title")}
        </Heading>
        <HStack mb={4} spacing={4}>
          <SpeciesPageLink showTaxon={showTaxon} />
          <ObservationsLink showTaxon={showTaxon} />
        </HStack>
        <Heading as="h3" size="md" mb={4}>
          {t("common:information")}
        </Heading>

        <Table borderRadius="lg" variant="striped" overflow="hidden">
          <Tbody>
            <Tr>
              <Td title={t("taxon:modal.attributes.name.desc")} w="12rem">
                {t("taxon:modal.attributes.name.title")}
              </Td>
              <Td>
                <span
                  dangerouslySetInnerHTML={{
                    __html: getInjectableHTML(modalTaxon?.italicisedForm)
                  }}
                />
              </Td>
            </Tr>
            <Tr>
              <Td title={t("taxon:modal.attributes.canonical.desc")}>
                {t("taxon:modal.attributes.canonical.title")}
              </Td>
              <Td>{modalTaxon?.canonicalForm}</Td>
            </Tr>
            <Tr>
              <Td title={t("taxon:modal.attributes.author.desc")}>
                {t("taxon:modal.attributes.author.title")}
              </Td>
              <Td>{modalTaxon?.authorYear}</Td>
            </Tr>
            <Tr>
              <Td title={t("taxon:modal.attributes.status.desc")}>
                {t("taxon:modal.attributes.status.title")}
              </Td>
              <Td>{modalTaxon?.status}</Td>
            </Tr>
            <Tr>
              <Td title={t("taxon:modal.attributes.rank.desc")}>
                {t("taxon:modal.attributes.rank.title")}
              </Td>
              <Td>{modalTaxon?.rank}</Td>
            </Tr>
            <Tr>
              <Td title={t("taxon:modal.attributes.source.desc")}>
                {t("taxon:modal.attributes.source.title")}
              </Td>
              <Td>{modalTaxon?.uploaderId}</Td>
            </Tr>
            <Tr>
              <Td title={t("taxon:modal.attributes.via.desc")}>
                {t("taxon:modal.attributes.via.title")}
              </Td>
              <Td>{modalTaxon?.viaDatasource}</Td>
            </Tr>
            <Tr>
              <Td title={t("taxon:modal.attributes.id.desc")}>
                {t("taxon:modal.attributes.id.title")}
              </Td>
              <Td>{modalTaxon?.matchId}</Td>
            </Tr>
            <Tr>
              <Td title={t("taxon:modal.attributes.position.desc")}>
                {t("taxon:modal.attributes.position.title")}
              </Td>
              <Td>{modalTaxon?.position}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Box>
        <Heading as="h3" size="md" mb={4}>
          {t("taxon:modal.attributes.rank.title")}
        </Heading>
        <Table borderRadius="lg" variant="striped" overflow="hidden">
          <Tbody>
            {modalTaxon?.hierarchy?.map((rank) => (
              <Tr key={rank.rankName}>
                <Td style={{ textTransform: "capitalize" }}>{rank.rankName}</Td>
                <Td>{rank.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </SimpleGrid>
  ) : (
    <Spinner />
  );
}
