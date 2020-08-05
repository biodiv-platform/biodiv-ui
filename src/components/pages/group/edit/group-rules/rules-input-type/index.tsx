import React from "react";
import DateRangePickerField from "@components/form/daterangepicker";
import CheckboxField from "@components/form/checkbox";
import AreaDrawField from "../../../common/area-draw-field";
import TaxonInputField from "./taxon-filter-field";

export default function RulesInputType({ inputType, form, name, label }) {
  switch (inputType) {
    case "hasUserRule":
      <CheckboxField name={name} label={label} form={form} />;
      break;
    case "spartialDataList":
      return <AreaDrawField label={label} name={name} form={form} mb={8} isRequired={true} />;

    case "taxonomicIdList":
      return <TaxonInputField name={name} form={form} label={label} />;
    case "createdOnDateList":
    case "observedOnDateList":
      return <DateRangePickerField form={form} name={name} label={label} />;
      break;
  }
}
