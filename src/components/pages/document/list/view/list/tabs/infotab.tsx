import React from "react";
import { Box, Heading, Text, Divider } from "@chakra-ui/core";
import FilterIconsList from "@components/pages/document/common/filter-list-icon";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import useTranslation from "@hooks/use-translation";
import PeopleIcon from "@icons/people";
import EditIcon from "@icons/edit";
import Grid from "@icons/grid";
import FeedBackIcon from "@icons/feedback";

export default function InfoTab({ document, habitatIds, specieIds }) {
  const { t } = useTranslation();
  const { habitats, species } = useDocumentFilter();
  return (
    <Box
      color="gray.600"
      boxSize="full"
      display="flex"
      minHeight="18rem"
      flexDir="column"
      justifyContent="flex-start"
    >
      <Heading size="sm" pt={2} m={1} title={document?.title}>
        <Text mr={2}>{document?.title || t("OBSERVATION.UNKNOWN")}</Text>
        <Divider m={3} />
      </Heading>
      {habitatIds[0] !== null && habitats && (
        <FilterIconsList
          title={t("GROUP.HABITATS_COVERED")}
          type="habitat"
          icon={<Grid />}
          filterIds={habitatIds}
          filterList={habitats}
        />
      )}
      {habitatIds[0] !== null && species && (
        <FilterIconsList
          title={t("GROUP.SPECIES_COVERAGE")}
          type="species"
          icon={<PeopleIcon />}
          filterIds={specieIds}
          filterList={species}
        />
      )}
      {document?.attribution && (
        <Box m={2}>
          <Text title="Attribution">
            <FeedBackIcon /> {document.attribution}
          </Text>
        </Box>
      )}
      {document?.notes && (
        <Box m={2}>
          <Text title="Abstract">
            <EditIcon /> {document?.notes?.replace(/<[^>]*>?/gm, "")}
          </Text>
        </Box>
      )}
    </Box>
  );
}
