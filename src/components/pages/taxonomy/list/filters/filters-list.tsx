import { Box } from "@chakra-ui/react";
import { TAXON_POSITION, TAXON_STATUS } from "@static/taxon";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot
} from "@/components/ui/accordion";

import useTaxonFilter from "../use-taxon";
import { CheckboxFilterPanel } from "./checkboxes";
import TaxonBrowser from "./taxon-browser";

export function FiltersList() {
  const { t } = useTranslation();
  const { taxonRanks } = useTaxonFilter();

  return (
    <AccordionRoot multiple={true} lazyMount defaultValue={["taxon"]}>
      <AccordionItem value="taxon">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:taxon_browser.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <Box p={4}>
            <TaxonBrowser />
          </Box>
        </AccordionItemContent>
      </AccordionItem>
      <CheckboxFilterPanel
        filterKey="rankList"
        translateKey="taxon:rank."
        options={taxonRanks}
        skipOptionsTranslation={true}
      />
      <CheckboxFilterPanel
        filterKey="statusList"
        translateKey="taxon:status."
        options={TAXON_STATUS}
        skipOptionsTranslation={true}
      />
      <CheckboxFilterPanel
        filterKey="positionList"
        translateKey="taxon:position."
        options={TAXON_POSITION}
        skipOptionsTranslation={true}
      />
    </AccordionRoot>
  );
}
