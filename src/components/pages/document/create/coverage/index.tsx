import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import IconCheckboxField from "@components/pages/group/common/icon-checkbox-field";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import WKTCoverage from "./wkt-coverage";

export default function Coverage({ speciesGroups, habitats }) {
  const { t } = useTranslation();

  return (
    <Box mb={6}>
      <PageHeading as="h2" size="lg" mr={4}>
        ⭐ {t("form:coverage.title")}
      </PageHeading>

      <IconCheckboxField
        name="speciesGroupIds"
        label={t("common:species_coverage")}
        options={speciesGroups}
        type="species"
      />

      <IconCheckboxField
        name="habitatIds"
        label={t("common:habitats_covered")}
        options={habitats}
        type="habitat"
      />

      <WKTCoverage name="docCoverageData" />
    </Box>
  );
}
