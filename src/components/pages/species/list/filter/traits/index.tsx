import { Box } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";
import useGlobalState from "@/hooks/use-global-state";
import { axGetAllTraitsMeta } from "@/services/species.service";

import useSpeciesList from "../../use-species-list";
import CheckboxFilterPanel from "../shared/checkbox";
import HsvColorFilter from "../shared/hsv-color-picker";
import SubAccordion from "../shared/sub-accordion";
import TraitDateRangeFilter from "../shared/trait-date-range";

const includedDataType = ["COLOR", "STRING", "DATE"];
const filterTraitsfromAggregation = (traits, ag) => {
  if (Object.keys(ag?.groupTraitsName)?.length <= 0) return [];
  return traits.map(({ categoryName, traitsValuePairList }) => ({
    categoryName,
    traitsValuePairList: traitsValuePairList
      .filter(({ traits: trait }) => includedDataType.includes(trait.dataType))
      .filter((f) => !Object.keys(ag.groupTraitsName).includes(f.traits.id))
  }));
};
export default function TraitsFilter() {
  const {
    traits,
    speciesData: { ag }
  } = useSpeciesList();
  const [traitsData, setTraitsData] = useState(traits);

  const { languageId } = useGlobalState();
  useEffect(() => {
    axGetAllTraitsMeta(languageId).then(({ data }) => setTraitsData(data));
  }, [languageId]);

  const traitsList = useMemo(() => filterTraitsfromAggregation(traitsData, ag), traitsData);

  return traitsList?.length > 0 ? (
    <SubAccordion>
      {traitsList?.map(({ categoryName, traitsValuePairList }) => (
        <AccordionItem value={categoryName} pl={4}>
          <AccordionItemTrigger pr={4}>
            <Box flex={1} textAlign="left">
              {categoryName.split(">")[1]}
            </Box>
          </AccordionItemTrigger>
          <AccordionItemContent>
            {traitsValuePairList?.map(({ traits: trait, values }) => {
              switch (trait.dataType) {
                case "COLOR":
                  return (
                    <HsvColorFilter
                      filterKey={`trait_${trait.traitId}.color_hsl`}
                      label={trait.name}
                    />
                  );
                case "DATE":
                  return (
                    <TraitDateRangeFilter
                      filterKey={`trait_${trait.traitId}.season`}
                      translateKey={trait.name}
                    />
                  );

                default:
                  return (
                    <CheckboxFilterPanel
                      key={trait.id}
                      label={trait.name}
                      filterKey={`trait_${trait.traitId}.string`}
                      options={values.map(({ value, icon, traitValueId }) => ({
                        label: value,
                        valueIcon: icon,
                        value: traitValueId.toString()
                      }))}
                      statKey={`groupTraits`}
                      skipOptionsTranslation={true}
                    />
                  );
              }
            })}
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </SubAccordion>
  ) : null;
}
