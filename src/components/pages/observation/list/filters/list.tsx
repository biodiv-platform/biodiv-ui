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

import CustomFieldsFilter from "./custom-fields";
import DataQuality from "./data-quality";
import DatasetFilter from "./dataset";
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

      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("filters:name.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Name />
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

      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("filters:dataset_filter.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <DatasetFilter />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                {t("filters:user.title")}
              </Box>
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
              <Box flex={1} textAlign="left">
                {t("filters:traits.title")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <TraitsFilter />}</AccordionPanel>
          </>
        )}
      </AccordionItem>

      <UserGroupFilter />

      {SITE_CONFIG.CUSTOM_FIELDS.ACTIVE && (
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <AccordionButton>
                <Box flex={1} textAlign="left">
                  {t("filters:custom_fields.title")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>{isExpanded && <CustomFieldsFilter />}</AccordionPanel>
            </>
          )}
        </AccordionItem>
      )}
    </Accordion>
  );
}
