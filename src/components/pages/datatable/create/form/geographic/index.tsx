import { Box } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import WKTFieldMulti from "@components/form/wkt-multi";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { LOCATION_ACCURACY_OPTIONS } from "@components/pages/observation/create/form/options";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function PartyContributorsForm({
  nameTitle = "placename",
  nameTopology = "topology",
  centroid = "centroid"
}) {
  const { t } = useTranslation();

  return (
    <ToggleablePanel icon="🌏" title={t("DATATABLE.GEOGRAPHICAL_COVERAGE")}>
      <Box p={4} pb={0}>
        <SelectInputField
          isRequired={true}
          name="locationScale"
          label={t("DATATABLE.LOCATION_SCALE")}
          options={LOCATION_ACCURACY_OPTIONS}
        />
        <WKTFieldMulti
          name="topologyData"
          isMultiple={false}
          centroid={centroid}
          label={t("DOCUMENT.COVERAGE.SPATIAL")}
          nameTitle={nameTitle}
          labelTitle={t("DOCUMENT.COVERAGE.PLACE")}
          nameTopology={nameTopology}
          labelTopology={t("DOCUMENT.COVERAGE.WKT")}
        />
      </Box>
    </ToggleablePanel>
  );
}
