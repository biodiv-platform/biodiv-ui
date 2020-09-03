import React from "react";
import DateRangePickerField from "@components/form/daterangepicker";
import CheckBoxField from "@components/form/checkbox";
import GeoJsonWktParserInput from "../geojson-wkt-inputfield";
import TaxonInputField from "./taxon-filter-field";
import useTranslation from "@configs/i18n/useTranslation";

export default function RulesInputType({ inputType, form, name }) {
  const { t } = useTranslation();
  switch (inputType) {
    case "hasUserRule":
      return <CheckBoxField name={name} form={form} label={t("GROUP.RULES.INPUT_TYPES.USER")} />;
    case "spartialDataList":
      return (
        <GeoJsonWktParserInput
          label={t("GROUP.RULES.INPUT_TYPES.SPATIAL")}
          name={name}
          form={form}
          mb={8}
          isRequired={true}
          isPolygon={true}
        />
      );
    case "taxonomicIdList":
      return (
        <TaxonInputField name={name} form={form} label={t("GROUP.RULES.INPUT_TYPES.TAXONOMY")} />
      );
    case "createdOnDateList":
    case "observedOnDateList":
      return (
        <DateRangePickerField
          form={form}
          name={name}
          label={t("GROUP.RULES.INPUT_TYPES.DATE_RANGE")}
        />
      );
      break;
  }
}
