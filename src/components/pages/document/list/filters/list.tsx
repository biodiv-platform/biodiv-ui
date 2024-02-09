import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React from "react";

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
    <Accordion defaultIndex={[0]} allowMultiple={true}>
      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("filters:species_group.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <SpeciesGroupsFilter />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("filters:location.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Location />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("filters:time.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <TimeFilter />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("filters:data_quality.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <DataQuality />
        </AccordionPanel>
      </AccordionItem>

      <ItemTypeFilter />

      <TitleFilter />

      <PublisherFilter />

      <AuthorFilter />

      <TagsFilter />

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                {t("filters:user.name_of_user")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <UserFilter filterKey="user" />}</AccordionPanel>
          </>
        )}
      </AccordionItem>
      {SITE_CONFIG.USERGROUP.ACTIVE && <UserGroupFilter />}
    </Accordion>
  );
}
