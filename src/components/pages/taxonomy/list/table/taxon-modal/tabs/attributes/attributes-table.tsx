import { Box, Heading, SimpleGrid, Spinner, Table } from "@chakra-ui/react";
import useTaxonFilter from "@components/pages/taxonomy/list/use-taxon";
import { getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";

import { DocumentsLink } from "../../document";
import { ObservationsLink } from "../../observation";
import { SpeciesPageLink } from "../../species";

export function TaxonAttributesTable() {
  const { modalTaxon, showTaxon } = useTaxonFilter();
  const { t } = useTranslation();

  return modalTaxon ? (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      <Box gridColumn={{ base: "auto", md: "1/3" }}>
        <Heading as="h3" size="md" mb={4}>
          {t("taxon:modal.data_links.title")}
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3} mb={4}>
          <SpeciesPageLink showTaxon={showTaxon} />
          <ObservationsLink showTaxon={showTaxon} />
          <DocumentsLink showTaxon={showTaxon} />
        </SimpleGrid>
        <Heading as="h3" size="md" mb={4}>
          {t("common:information")}
        </Heading>

        <Box overflowX="auto" borderRadius="lg">
          <Table.Root borderRadius="lg" striped size={{ base: "sm", md: "md" }}>
            <Table.Body>
              <Table.Row>
                <Table.Cell
                  title={t("taxon:modal.attributes.name.desc")}
                  w={{ base: "35%", md: "12rem" }}
                >
                  {t("taxon:modal.attributes.name.title")}
                </Table.Cell>
                <Table.Cell wordBreak="break-word">
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
                <Table.Cell wordBreak="break-word">{modalTaxon?.canonicalForm}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell title={t("taxon:modal.attributes.author.desc")}>
                  {t("taxon:modal.attributes.author.title")}
                </Table.Cell>
                <Table.Cell wordBreak="break-word">{modalTaxon?.authorYear}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell title={t("taxon:modal.attributes.status.desc")}>
                  {t("taxon:modal.attributes.status.title")}
                </Table.Cell>
                <Table.Cell wordBreak="break-word">{modalTaxon?.status}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell title={t("taxon:modal.attributes.rank.desc")}>
                  {t("taxon:modal.attributes.rank.title")}
                </Table.Cell>
                <Table.Cell wordBreak="break-word">
                  {t(`taxon:hierarchy.${modalTaxon?.rank}`)}
                </Table.Cell>
              </Table.Row>
              {modalTaxon?.status == "SYNONYM" && (
                <Table.Row>
                  <Table.Cell>{"Accepted Name"}</Table.Cell>
                  <Table.Cell wordBreak="break-word">
                    {modalTaxon?.hierarchy[modalTaxon?.hierarchy?.length - 1]?.name}
                  </Table.Cell>
                </Table.Row>
              )}
              <Table.Row>
                <Table.Cell title={t("taxon:modal.attributes.source.desc")}>
                  {t("taxon:modal.attributes.source.title")}
                </Table.Cell>
                <Table.Cell wordBreak="break-word">{modalTaxon?.uploaderId}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell title={t("taxon:modal.attributes.via.desc")}>
                  {t("taxon:modal.attributes.via.title")}
                </Table.Cell>
                <Table.Cell wordBreak="break-word">{modalTaxon?.viaDatasource}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell title={t("taxon:modal.attributes.id.desc")}>
                  {t("taxon:modal.attributes.id.title")}
                </Table.Cell>
                <Table.Cell wordBreak="break-word">{modalTaxon?.matchId}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell title={t("taxon:modal.attributes.position.desc")}>
                  {t("taxon:modal.attributes.position.title")}
                </Table.Cell>
                <Table.Cell wordBreak="break-word">{modalTaxon?.position}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
      <Box>
        <Heading as="h3" size="md" mb={4}>
          {t("taxon:modal.attributes.rank.title")}
        </Heading>
        <Box overflowX="auto" borderRadius="lg">
          <Table.Root borderRadius="lg" striped size={{ base: "sm", md: "md" }}>
            <Table.Body>
              {modalTaxon?.hierarchy?.map((rank) => (
                <Table.Row key={rank.rankName}>
                  <Table.Cell w={{ base: "35%", md: "auto" }}>
                    {t(`taxon:hierarchy.${rank.rankName}`)}
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      hyphens: "auto"
                    }}
                  >
                    {rank.name}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </SimpleGrid>
  ) : (
    <Spinner />
  );
}
