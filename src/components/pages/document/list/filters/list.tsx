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

import AuthorFilter from "./author";
import DataQuality from "./data-quality";
import ItemTypeFilter from "./itemType";
import Location from "./location";
import UserFilter from "./name-of-user";
import PublisherFilter from "./publisher";
import SpeciesGroupsFilter from "./species-groups";
import TagsFilter from "./tags";
import TimeFilter from "./time";
import TitleFilter from "./title";
import UserGroupFilter from "./user-group";

export default function FiltersList() {
  const { t } = useTranslation();

  return (
    <AccordionRoot multiple={true} lazyMount defaultValue={["species"]}>
      <AccordionItem value="species">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:species_group.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <SpeciesGroupsFilter />
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
          <Box p={4}>
            <TimeFilter />
          </Box>
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

      <ItemTypeFilter />

      <TitleFilter />

      <PublisherFilter />

      <AuthorFilter />

      <TagsFilter />

      <AccordionItem value="user" pl={4}>
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left">
            {t("filters:user.name_of_user")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent pr={4}>{<UserFilter filterKey="user" />}</AccordionItemContent>
      </AccordionItem>

      {SITE_CONFIG.USERGROUP.ACTIVE && <UserGroupFilter />}
    </AccordionRoot>
  );
}
