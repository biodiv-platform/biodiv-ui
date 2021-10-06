import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import TaxonInputField from "../../role/taxon-filter";
import FilterCheckboxes, { FilterCheckboxesProps } from "./checkboxes";

export default function CheckboxFilterPanel(props: FilterCheckboxesProps) {
  const { t } = useTranslation();

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton>
            <Box flex={1} textAlign="left">
              {props.label || t(props.translateKey + "title")}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {props.isTaxonFilter && (
              <TaxonInputField translateKey="filters:user.taxon_browser" filterKey="taxonomyList" />
            )}
            {isExpanded && <FilterCheckboxes {...props} />}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
