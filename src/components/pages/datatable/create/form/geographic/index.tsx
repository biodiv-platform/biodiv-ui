import { Box, SimpleGrid } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import Select from "@components/form/select";
import WKTFieldMulti from "@components/form/wkt-multi";
import {
  DATE_ACCURACY_OPTIONS,
  LOCATION_ACCURACY_OPTIONS
} from "@components/pages/observation/create/form/options";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function PartyContributorsForm({
  form,
  nameTitle = "placename",
  nameTopology = "topology",
  centroid = "centroid"
}) {
  const { t } = useTranslation();

  return (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>🌏 {t("Geographic Coverage")}</BoxHeading>
      <SimpleGrid columns={[1, 1, 2, 2]} spacing={2}>
        <Select
          isRequired={true}
          name="locationAccuracy"
          label={t("DATATABLE.LOCATION_ACCURACY")}
          options={DATE_ACCURACY_OPTIONS}
          form={form}
        />
        <Select
          isRequired={true}
          name="locationScale"
          label={t("DATATABLE.LOCATION_SCALE")}
          options={LOCATION_ACCURACY_OPTIONS}
          form={form}
        />
      </SimpleGrid>

      <WKTFieldMulti
        name="topologyData"
        isMultiple={false}
        centroid={centroid}
        label={t("DOCUMENT.COVERAGE.SPATIAL")}
        nameTitle={nameTitle}
        labelTitle={t("DOCUMENT.COVERAGE.PLACE")}
        nameTopology={nameTopology}
        labelTopology={t("DOCUMENT.COVERAGE.WKT")}
        form={form}
      />
    </Box>
  );
}
