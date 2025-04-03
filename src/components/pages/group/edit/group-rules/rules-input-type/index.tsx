import { Box, SimpleGrid } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { DateRangePickerField } from "@components/form/daterangepicker";
import { SelectInputField } from "@components/form/select";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import GeoJsonWktParserInput from "../geojson-wkt-inputfield";
import TaxonInputField from "./taxon-filter-field";

export default function RulesInputType({ inputType, name, traits }) {
  const { t } = useTranslation();
  const [options, setOptions] = useState([])
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
    case "traitList":
      return (
        <Box mb={2}>
          <SimpleGrid columns={{ md: 2 }} spacing={4} mb={4} mt={2}>
            <Box>
              <SelectInputField
              name= {name+"[0].trait"}
              label={"Trait Name"}
              options={traits.filter(trait => trait.traits.dataType === "STRING").map((trait,index) => ({
                label: trait.traits.name,
                value: trait.traits.id+"|"+index
              }))}
              shouldPortal={true}
              onChangeCallback={(v)=>setOptions(traits[parseInt(v.split("|")[1],10)].values)}
              />
            </Box>
            <Box>
            <SelectInputField
              name= {name+"[0].value"}
              label={"Trait Value"}
              options={options.map(option=>({
                label: option.value,
                value: option.id
              }))}
              shouldPortal={true}
              />
            </Box>
          </SimpleGrid>
        </Box>
      );

    default:
      return null;
  }
}
