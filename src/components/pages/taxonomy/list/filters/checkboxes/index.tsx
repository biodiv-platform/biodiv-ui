import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import { FilterCheckboxes, FilterCheckboxesProps } from "./checkboxes";

export function CheckboxFilterPanel(props: FilterCheckboxesProps) {
  const { t } = useTranslation();

  return (
    <AccordionItem value={props.filterKey} pl={4}>
      <AccordionItemTrigger pr={4}>
        <Box flex={1} textAlign="left">
          {props.label || t(props.translateKey + "title")}
        </Box>
      </AccordionItemTrigger>
      <AccordionItemContent>{<FilterCheckboxes {...props} />}</AccordionItemContent>
    </AccordionItem>
  );
}
