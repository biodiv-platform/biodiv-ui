import { Box } from "@chakra-ui/react";
import React, { useMemo } from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import useSpeciesList from "../../use-species-list";
import CheckboxFilterPanel from "../shared/checkbox";
import HsvColorFilter from "../shared/hsv-color-picker";
import SubAccordion from "../shared/sub-accordion";

const includedDataType = ["COLOR", "STRING"];
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

  const traitsList = useMemo(() => filterTraitsfromAggregation(traits, ag), traits);

  return traitsList?.length > 0 ? (
    <SubAccordion>
      {traitsList?.map(({ categoryName, traitsValuePairList }) => (
        <AccordionItem value={categoryName}>
          <AccordionItemTrigger>
            <Box flex={1} textAlign="left">
              {categoryName.split(">")[1]}
            </Box>
          </AccordionItemTrigger>
          <SubAccordion>
            <AccordionItemContent>
              {traitsValuePairList?.map(({ traits: trait, values }) => {
                switch (trait.dataType) {
                  case "COLOR":
                    return (
                      <HsvColorFilter
                        filterKey={`trait_${trait.id}.color_hsl`}
                        label={trait.name}
                      />
                    );

                  default:
                    return (
                      <CheckboxFilterPanel
                        key={trait.id}
                        label={trait.name}
                        filterKey={`trait_${trait.id}.string`}
                        options={values.map(({ value, icon, id }) => ({
                          label: value,
                          valueIcon: icon,
                          value: id.toString()
                        }))}
                        statKey={`groupTraits`}
                        skipOptionsTranslation={true}
                      />
                    );
                }
              })}
            </AccordionItemContent>
          </SubAccordion>
        </AccordionItem>
      ))}
    </SubAccordion>
  ) : null;
}
