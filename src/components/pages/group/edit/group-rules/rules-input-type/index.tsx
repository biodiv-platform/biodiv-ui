import { CheckboxField } from "@components/form/checkbox";
import { DateRangePickerField } from "@components/form/daterangepicker";
import useTranslation from "@hooks/use-translation";
import React from "react";

import GeoJsonWktParserInput from "../geojson-wkt-inputfield";
import TaxonInputField from "./taxon-filter-field";

export default function RulesInputType({ inputType, name }) {
  const { t } = useTranslation();
  switch (inputType) {
    case "hasUserRule":
      return <CheckboxField name={name} label={t("GROUP.RULES.INPUT_TYPES.USER")} />;
    case "spartialDataList":
      return (
        <GeoJsonWktParserInput
          label={t("GROUP.RULES.INPUT_TYPES.SPATIAL")}
          name={name}
          mb={8}
          isRequired={true}
          isPolygon={true}
        />
      );
    case "taxonomicIdList":
      return <TaxonInputField name={name} label={t("GROUP.RULES.INPUT_TYPES.TAXONOMY")} />;
    case "createdOnDateList":
    case "observedOnDateList":
      return (
        <DateRangePickerField
          hasMaxDate={false}
          name={name}
          label={t("GROUP.RULES.INPUT_TYPES.DATE_RANGE")}
        />
      );

    default:
      return null;
  }
}
