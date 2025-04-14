import { Box, IconButton, Link as ChakraLink, useToken } from "@chakra-ui/react";
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
        <MenuTrigger m={1} as={IconButton} aria-label="Options" bg="white">
          <LuMenu />
        </MenuTrigger>
        <MenuContent>
          <Link href="#synonyms">
            <MenuItem as={ChakraLink} value="#synonyms">
              {t("species:synonyms")}
            </MenuItem>
          </Link>
          <Link href="#common-names">
            <MenuItem as={ChakraLink} value="#common-names">
              {t("species:common_names")}
            </MenuItem>
          </Link>

          {fieldHeaders.map(({ header }) => (
            <Link href={`#${urlSlug(header)}`}>
              <MenuItem as={ChakraLink} value={`#${urlSlug(header)}`} key={header}>
                {header}
              </MenuItem>
            </Link>
          ))}
        </MenuContent>
      </MenuRoot>
    </Box>
  );
}
