import { CheckboxField } from "@components/form/checkbox";
import { DateRangePickerField } from "@components/form/daterangepicker";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import GeoJsonWktParserInput from "../geojson-wkt-inputfield";
import TaxonInputField from "./taxon-filter-field";

export default function RulesInputType({ inputType, name }) {
  const { t } = useTranslation();
  switch (inputType) {
    case "hasUserRule":
      return <CheckboxField name={name} label={t("group:rules.input_types.user")} />;
    case "spartialDataList":
      return (
        <GeoJsonWktParserInput
          label={t("group:rules.input_types.spatial")}
          name={name}
          mb={8}
          isRequired={true}
          isPolygon={true}
        />
      );
    case "taxonomicIdList":
      return <TaxonInputField name={name} label={t("group:rules.input_types.taxonomy")} />;
    case "createdOnDateList":
    case "observedOnDateList":
      return <DateRangePickerField hasMaxDate={false} name={name} label={t("form:date_range")} />;

    default:
      return null;
  }
}
