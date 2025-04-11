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

import CustomFieldsFilter from "./custom-fields";
import DataQuality from "./data-quality";
import DatasetFilter from "./dataset";
import Location from "./location";
import MediaType from "./media-type";
import Name from "./name";
import UserFilter from "./name-of-user";
import SpeciesGroupsFilter from "./species-groups";
import TaxonBrowser from "./taxon-browser";
import TimeFilter from "./time";
import TraitsFilter from "./traits";
import UserGroupFilter from "./user-group";

export default function FiltersList() {
  const { t } = useTranslation();

  return (
    <AccordionRoot defaultValue={["speciesGroup"]} multiple>
      <AccordionItem value="speciesGroup">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:species_group.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <SpeciesGroupsFilter />
        </AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="taxon">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:taxon_browser.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <TaxonBrowser />
        </AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="scientificName">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:name.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <Name />
        </AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="location">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:location.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <Location />
        </AccordionItemContent>
      </AccordionItem>

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

      <AccordionItem value="dataQuality">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:data_quality.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <DataQuality />
        </AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="dataset">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:dataset_filter.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <DatasetFilter />
        </AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="user">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:user.name_of_user")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <UserFilter filterKey="user" />
        </AccordionItemContent>
      </AccordionItem>

      <MediaType />

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

      <UserGroupFilter />

      {SITE_CONFIG.CUSTOM_FIELDS.ACTIVE && (
        <AccordionItem value="custom_fields">
          <AccordionItemTrigger pr={4}>
            <Box flex={1} textAlign="left" pl={4}>
              {t("filters:custom_fields.title")}
            </Box>
          </AccordionItemTrigger>
          <AccordionItemContent>
            <CustomFieldsFilter />
          </AccordionItemContent>
        </AccordionItem>
      )}
    </AccordionRoot>
  );
}
