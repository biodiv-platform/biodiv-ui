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

import AttributeFilter from "./attribute";
import CommonNameFilter from "./commonName";
import MediaType from "./media";
import RankFilter from "./rank";
import ReferenceFilter from "./reference";
import ScientificNameFilter from "./scientificName";
import SpeciesFieldFilter from "./species-field";
import SpeciesGroupsFilter from "./species-groups";
import TaxonBrowser from "./taxon-browser";
import TimeFilter from "./time";
import TraitsFilter from "./traits";
import UserFilter from "./user";
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

      <ScientificNameFilter />

      <CommonNameFilter />

      <RankFilter />

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                {t("filters:species_field.title")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <SpeciesFieldFilter />}</AccordionPanel>
          </>
        )}
      </AccordionItem>

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                {t("filters:traits.title")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <TraitsFilter />}</AccordionPanel>
          </>
        )}
      </AccordionItem>

      <AttributeFilter />

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                {t("filters:user.contributor")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <UserFilter filterKey="user" />}</AccordionPanel>
          </>
        )}
      </AccordionItem>

      <ReferenceFilter />

      <MediaType />

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
      {SITE_CONFIG.USERGROUP.ACTIVE && <UserGroupFilter />}
    </Accordion>
  );
}
