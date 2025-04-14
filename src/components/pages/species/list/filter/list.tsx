import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot
} from "@/components/ui/accordion";

import AttributeFilter from "./attribute";
import CommonNameFilter from "./commonName";
import MediaType from "./media";
import UserFilter from "./name-of-user";
import RankFilter from "./rank";
import ReferenceFilter from "./reference";
import ScientificNameFilter from "./scientificName";
import SpeciesFieldFilter from "./species-field";
import SpeciesGroupsFilter from "./species-groups";
import TaxonBrowser from "./taxon-browser";
import TimeFilter from "./time";
import TraitsFilter from "./traits";
import UserGroupFilter from "./user-group";

export default function FiltersList() {
  const { t } = useTranslation();

  return (
    <AccordionRoot multiple defaultValue={["species_group"]}>
      <AccordionItem value="species_group">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:species_group.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <SpeciesGroupsFilter />
        </AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="taxon_browser">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:taxon_browser.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <TaxonBrowser />
        </AccordionItemContent>
      </AccordionItem>

      <ScientificNameFilter />
      <CommonNameFilter />
      <RankFilter />

      <AccordionItem value="species_field">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:species_field.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <SpeciesFieldFilter />
        </AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="traits">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:traits.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <TraitsFilter />
        </AccordionItemContent>
      </AccordionItem>

      <AttributeFilter />

      <AccordionItem value="user">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:user.contributor")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <UserFilter filterKey="user" />
        </AccordionItemContent>
      </AccordionItem>

      <ReferenceFilter />
      <MediaType />

      <AccordionItem value="time">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:time.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <TimeFilter />
        </AccordionItemContent>
      </AccordionItem>

      {SITE_CONFIG.USERGROUP.ACTIVE && <UserGroupFilter />}
    </AccordionRoot>
  );
}
