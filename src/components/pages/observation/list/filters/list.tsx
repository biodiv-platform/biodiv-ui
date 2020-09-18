import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import CustomFieldsFilter from "./custom-fields";
import DataQuality from "./data-quality";
import Location from "./location";
import MediaType from "./media-type";
import Name from "./name";
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
          <div>{t("FILTERS.SPECIES_GROUP.TITLE")}</div>
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
              <div>{t("FILTERS.TAXON_BROWSER.TITLE")}</div>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <TaxonBrowser />}</AccordionPanel>
          </>
        )}
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <div>{t("FILTERS.NAME.TITLE")}</div>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Name />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <div>{t("FILTERS.LOCATION.TITLE")}</div>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Location />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <div>{t("FILTERS.TIME.TITLE")}</div>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <TimeFilter />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <div>{t("FILTERS.DATA_QUALITY.TITLE")}</div>
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
              <div>{t("FILTERS.USER.TITLE")}</div>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <UserFilter filterKey="user" />}</AccordionPanel>
          </>
        )}
      </AccordionItem>

      <MediaType />

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <div>{t("FILTERS.TRAITS.TITLE")}</div>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <TraitsFilter />}</AccordionPanel>
          </>
        )}
      </AccordionItem>

      <UserGroupFilter />

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <div>{t("FILTERS.CUSTOM_FIELDS.TITLE")}</div>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <CustomFieldsFilter />}</AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
}
