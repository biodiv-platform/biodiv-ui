import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import { TAXON_POSITION, TAXON_STATUS } from "@static/taxon";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useTaxonFilter from "../use-taxon";
import { CheckboxFilterPanel } from "./checkboxes";
import TaxonBrowser from "./taxon-browser";

export function FiltersList() {
  const { t } = useTranslation();
  const { taxonRanks } = useTaxonFilter();

  return (
    <Accordion defaultIndex={[0]} allowMultiple={true}>
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                {t("filters:taxon_browser.title")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <TaxonBrowser />}</AccordionPanel>
          </>
        )}
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
    </Accordion>
  );
}
