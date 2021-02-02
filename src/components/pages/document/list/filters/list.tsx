import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import useTranslation from "@hooks/use-translation";
import React from "react";

import DataQuality from "./data-quality";
import Location from "./location";
import SpeciesGroupsFilter from "./species-groups";
import TimeFilter from "./time";
import UserFilter from "./user";
import UserGroupFilter from "./user-group";

export default function FiltersList() {
  const { t } = useTranslation();

  return (
    <Accordion defaultIndex={[0]} allowMultiple={true}>
      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("FILTERS.SPECIES_GROUP.TITLE")}
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
            {t("FILTERS.TIME.TITLE")}
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
            {t("FILTERS.DATA_QUALITY.TITLE")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <DataQuality />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                {t("FILTERS.USER.TITLE")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <UserFilter filterKey="user" />}</AccordionPanel>
          </>
        )}
      </AccordionItem>
      {SITE_CONFIG.USERGROUP.ACTIVE && <UserGroupFilter />}
      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("FILTERS.LOCATION.TITLE")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Location />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}