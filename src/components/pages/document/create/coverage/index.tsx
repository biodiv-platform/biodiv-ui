import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import WKTFieldMulti from "@components/form/wkt-multi";
import IconCheckboxField from "@components/pages/group/common/icon-checkbox-field";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function Coverage({ hForm, speciesGroups, habitats }) {
  const { t } = useTranslation();

  return (
    <Box mb={6}>
      <PageHeading as="h2" size="lg" mr={4}>
        ⭐ {t("DOCUMENT.COVERAGE.TITLE")}
      </PageHeading>

      <IconCheckboxField
        name="speciesGroupIds"
        label={t("GROUP.SPECIES_COVERAGE")}
        form={hForm}
        options={speciesGroups}
        type="species"
      />

      <IconCheckboxField
        name="habitatIds"
        label={t("GROUP.HABITATS_COVERED")}
        options={habitats}
        form={hForm}
        type="habitat"
      />

      <WKTFieldMulti
        name="docCoverageData"
        label={t("DOCUMENT.COVERAGE.SPATIAL")}
        nameTitle="placename"
        labelTitle={t("DOCUMENT.COVERAGE.PLACE")}
        nameTopology="topology"
        labelTopology={t("DOCUMENT.COVERAGE.WKT")}
        form={hForm}
      />
    </Box>
  );
}
