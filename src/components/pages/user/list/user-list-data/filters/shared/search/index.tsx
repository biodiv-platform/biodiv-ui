import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import TextFilterInput from "./input";

export default function TextFilterPanel({ filterKey, translateKey }) {
  const { t } = useTranslation();
  const label = t(translateKey + "title");

  return (
    <AccordionItem value={filterKey} pl={4}>
      <AccordionItemTrigger pr={4}>
        <Box flex={1} textAlign="left">
          {label}
        </Box>
      </AccordionItemTrigger>
      <AccordionItemContent pr={4}>
        <TextFilterInput filterKey={filterKey} label={label} />
      </AccordionItemContent>
    </AccordionItem>
  );
}
