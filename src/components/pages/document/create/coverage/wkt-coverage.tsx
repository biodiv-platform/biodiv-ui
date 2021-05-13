import WKTFieldMulti from "@components/form/wkt-multi";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function WKTCoverage({
  hForm,
  name,
  nameTitle = "placename",
  nameTopology = "topology",
  centroid = "centroid"
}) {
  const { t } = useTranslation();

  return (
    <WKTFieldMulti
      name={name}
      label={t("DOCUMENT.COVERAGE.SPATIAL")}
      nameTitle={nameTitle}
      centroid={centroid}
      labelTitle={t("DOCUMENT.COVERAGE.PLACE")}
      nameTopology={nameTopology}
      labelTopology={t("DOCUMENT.COVERAGE.WKT")}
      form={hForm}
    />
  );
}
