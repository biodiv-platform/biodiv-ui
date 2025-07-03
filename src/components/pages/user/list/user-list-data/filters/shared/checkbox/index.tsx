import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import TaxonInputField from "../../role/taxon-filter";
import FilterCheckboxes, { FilterCheckboxesProps } from "./checkboxes";

export default function CheckboxFilterPanel(props: FilterCheckboxesProps) {
  const { t } = useTranslation();

  return (
    <AccordionItem value={props.filterKey} pl={4}>
      <AccordionItemTrigger pr={4}>
        <Box flex={1} textAlign="left">
          {props.label || t(props.translateKey + "title")}
        </Box>
      </AccordionItemTrigger>
      <AccordionItemContent pr={4}>
        {props.isTaxonFilter && (
          <TaxonInputField translateKey="filters:user.taxon_browser" filterKey="taxonomyList" />
        )}
        {<FilterCheckboxes {...props} />}
      </AccordionItemContent>
    </AccordionItem>
  );
}
