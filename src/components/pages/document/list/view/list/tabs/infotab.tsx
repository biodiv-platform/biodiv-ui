import React from "react";
import { Box, Heading, Text, Divider } from "@chakra-ui/core";
import FilterIconsList from "@components/pages/document/common/filter-list-icon";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import useTranslation from "@hooks/use-translation";

export default function InfoTab({ document, habitatIds }) {
  const { t } = useTranslation();
  const { habitats } = useDocumentFilter();
  return (
    <Box
      color="gray.600"
      boxSize="full"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
    >
      <Heading size="sm" pt={2} m={1} title={document?.title}>
        <Text as="i" mr={2}>
          {document?.title || t("OBSERVATION.UNKNOWN")}
        </Text>
        <Divider m={3} />
      </Heading>
      {habitatIds[0] !== null && habitats && (
        <FilterIconsList
          title={t("GROUP.HABITATS_COVERED")}
          type="habitat"
          filterIds={habitatIds}
          filterList={habitats}
        />
      )}
      <Box m={2}>Attribution : {document.attribution}</Box>
      <Box m={2}>Contributors : {document.contributors}</Box>
      <Box m={2}>Abstract : {document.notes}</Box>
    </Box>
  );
}
