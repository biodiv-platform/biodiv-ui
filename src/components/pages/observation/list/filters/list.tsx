import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import DataQuality from "./data-quality";
import Location from "./location";
import MediaType from "./media-type";
import Name from "./name";
import SpeciesGroupsFilter from "./species-groups";
import TaxonBrowser from "./taxon-browser";
import TimeFilter from "./time";
import TraitsFilter from "./traits";
import UserGroupFilter from "./user-group";

export default function FiltersList() {
  const { t } = useTranslation();

  return (
    <Accordion defaultIndex={[0]} allowMultiple={true}>
      <AccordionItem>
        <AccordionHeader>
          <div>{t("FILTERS.SPECIES_GROUP.TITLE")}</div>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          <SpeciesGroupsFilter />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionHeader>
              <div>{t("FILTERS.TAXON_BROWSER.TITLE")}</div>
              <AccordionIcon />
            </AccordionHeader>
            <AccordionPanel>{isExpanded && <TaxonBrowser />}</AccordionPanel>
          </>
        )}
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          <div>{t("FILTERS.NAME.TITLE")}</div>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          <Name />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          <div>{t("FILTERS.LOCATION.TITLE")}</div>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          <Location />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          <div>{t("FILTERS.TIME.TITLE")}</div>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          <TimeFilter />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionHeader>
          <div>{t("FILTERS.DATA_QUALITY.TITLE")}</div>
          <AccordionIcon />
        </AccordionHeader>
        <AccordionPanel>
          <DataQuality />
        </AccordionPanel>
      </AccordionItem>

      <MediaType />
      <UserGroupFilter />

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionHeader>
              <div>{t("FILTERS.TRAITS.TITLE")}</div>
              <AccordionIcon />
            </AccordionHeader>
            <AccordionPanel>{isExpanded && <TraitsFilter />}</AccordionPanel>
          </>
        )}
      </AccordionItem>

      <Box textAlign="center" p={4}>
        More filters coming soon 🎉
      </Box>
    </Accordion>
  );
}
