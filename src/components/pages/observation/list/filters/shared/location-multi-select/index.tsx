import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import FilterMultiSelectInput, { FilterMultiSelectProps } from "./input";

export default function FilterMultiSelectPanel({
  filterKey,
  translateKey,
  options
}: FilterMultiSelectProps) {
  const { t } = useTranslation();
  const label = translateKey && t(translateKey);

  return (
    <AccordionItem value={filterKey} pl={4}>
      <AccordionItemTrigger pr={4}>
        <Box flex={1} textAlign="left">
          {label}
        </Box>
      </AccordionItemTrigger>
      <AccordionItemContent pl={4} pr={4}>
        <FilterMultiSelectInput filterKey={filterKey} label={label} options={options} />
      </AccordionItemContent>
    </AccordionItem>
  );
}
