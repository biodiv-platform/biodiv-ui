import { Box } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import WKTFieldMulti from "@components/form/wkt-multi";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { LOCATION_ACCURACY_OPTIONS } from "@components/pages/observation/create/form/options";
import { translateOptions } from "@utils/i18n";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

export default function PartyContributorsForm({
  nameTitle = "placename",
  nameTopology = "topology",
  centroid = "centroid"
}) {
  const { t } = useTranslation();
  const translatedLocationOptions = useMemo(
    () => translateOptions(t, LOCATION_ACCURACY_OPTIONS),
    []
  );

  return (
    <ToggleablePanel icon="🌏" title={t("datatable:geographical_coverage")}>
      <Box p={4} pb={0}>
        <SelectInputField
          isRequired={true}
          name="locationScale"
          label={t("datatable:location_scale")}
          options={translatedLocationOptions}
        />
        <WKTFieldMulti
          name="topologyData"
          isMultiple={false}
          gMapTab={false}
          centroid={centroid}
          label={t("form:coverage.spatial")}
          nameTitle={nameTitle}
          canDraw={true}
          labelTitle={t("form:coverage.place")}
          nameTopology={nameTopology}
          labelTopology={t("form:coverage.wkt")}
        />
      </Box>
    </ToggleablePanel>
  );
}
