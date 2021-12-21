import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import React from "react";

import useSpeciesList from "../../use-species-list";
import CheckboxFilterPanel from "../shared/checkbox";
import SubAccordion from "../shared/sub-accordion";

export default function TraitsFilter() {
  const { traits } = useSpeciesList();

  return traits?.length ? (
    <SubAccordion>
      {traits?.map(({ categoryName, traitsValuePairList }) => (
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <AccordionButton>
                <Box flex={1} textAlign="left">
                  {categoryName.replace(">", "|")}
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
