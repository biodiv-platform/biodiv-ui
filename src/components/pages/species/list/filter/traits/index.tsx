import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import React, { useMemo } from "react";

import useSpeciesList from "../../use-species-list";
import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";

const filterTraitsfromAggregation = (traits, ag) => {
  if (Object.keys(ag?.groupTraitsName)?.length <= 0) return [];
  return traits
    .map(({ categoryName, traitsValuePairList }) => ({
      categoryName,
      traitsValuePairList: traitsValuePairList.filter((f) =>
        Object.keys(ag.groupTraitsName).includes(`${f.traits.id}`)
      )
    }))
    .filter((i) => i?.traitsValuePairList?.some((item) => item.values.length > 0));
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
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <AccordionButton>
                <Box flex={1} textAlign="left">
                  {categoryName.split(">")[1]}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <SubAccordion>
                <AccordionPanel>
                  {isExpanded &&
                    traitsValuePairList?.map(({ traits: trait, values }) => (
                      <CheckboxFilterPanel
                        key={trait.id}
                        label={trait.name}
                        filterKey={"traits"}
                        options={values.map(({ value, icon, id }) => ({
                          label: value,
                          valueIcon: icon,
                          value: id.toString()
                        }))}
                        statKey={`groupTraits`}
                        skipOptionsTranslation={true}
                      />
                    ))}
                </AccordionPanel>
              </SubAccordion>
            </>
          )}
        </AccordionItem>
      ))}
    </SubAccordion>
  ) : null;
}
