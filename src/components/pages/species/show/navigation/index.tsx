import { Box, IconButton, useToken } from "@chakra-ui/react";
import { getSpeciesFieldHeaders } from "@utils/species";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuMenu } from "react-icons/lu";
import urlSlug from "url-slug";

import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

import useSpecies from "../use-species";

export default function SpeciesNavigation() {
  const { t } = useTranslation();
  const { species } = useSpecies();
  const fieldHeaders = getSpeciesFieldHeaders(species.fieldData);
  const [zIndicesSticky] = useToken("zIndices", ["sticky"]);

  return (
    <Box position="sticky" top="0" h={0} zIndex={zIndicesSticky}>
      <MenuRoot>
        <MenuTrigger m={1} aria-label="Options">
          <IconButton variant={"subtle"}>
            <LuMenu />
          </IconButton>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="#synonyms">
            <Link href="#synonyms">{t("species:synonyms")}</Link>
          </MenuItem>

          <MenuItem value="#common-names">
            <Link href="#common-names">{t("species:common_names")}</Link>
          </MenuItem>

          {fieldHeaders.map(({ header }) => (
            <MenuItem value={`#${urlSlug(header)}`} key={header}>
              <Link href={`#${urlSlug(header)}`}>{header}</Link>
            </MenuItem>
          ))}
        </MenuContent>
      </MenuRoot>
    </Box>
  );
}
