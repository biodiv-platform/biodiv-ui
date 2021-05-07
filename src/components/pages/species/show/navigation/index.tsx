import { Box, GridItem, List, ListItem } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import useTranslation from "@hooks/use-translation";
import { getSpeciesFieldHeaders } from "@utils/species";
import React from "react";
import urlSlug from "url-slug";

import useSpecies from "../use-species";

export default function SpeciesNavigation() {
  const { t } = useTranslation();
  const { species } = useSpecies();
  const fieldHeaders = getSpeciesFieldHeaders(species.fieldData);

  return (
    <GridItem>
      <Box p={4} className="white-box" position="sticky" top="1rem">
        <List spacing={4} fontWeight="semibold">
          <ListItem>
            <BlueLink href="#synonyms">{t("SPECIES.SYNONYMS")}</BlueLink>
          </ListItem>
          <ListItem>
            <BlueLink href="#common-names">{t("SPECIES.COMMON_NAMES")}</BlueLink>
          </ListItem>
          {fieldHeaders.map((title) => (
            <ListItem key={title}>
              <BlueLink href={`#${urlSlug(title)}`}>{title}</BlueLink>
            </ListItem>
          ))}
        </List>
      </Box>
    </GridItem>
  );
}
