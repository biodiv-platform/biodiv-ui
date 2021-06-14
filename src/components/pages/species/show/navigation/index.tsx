import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToken
} from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import { getSpeciesFieldHeaders } from "@utils/species";
import React from "react";
import urlSlug from "url-slug";

import useSpecies from "../use-species";

export default function SpeciesNavigation() {
  const { t } = useTranslation();
  const { species } = useSpecies();
  const fieldHeaders = getSpeciesFieldHeaders(species.fieldData);
  const [zIndicesSticky] = useToken("zIndices", ["sticky"]);

  return (
    <Box position="sticky" top="0" h={0} zIndex={zIndicesSticky}>
      <Menu>
        <MenuButton
          m={1}
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
          bg="white"
        />
        <MenuList>
          <MenuItem as={Link} href="#synonyms">
            {t("SPECIES.SYNONYMS")}
          </MenuItem>
          <MenuItem as={Link} href="#common-names">
            {t("SPECIES.COMMON_NAMES")}
          </MenuItem>
          {fieldHeaders.map((title) => (
            <MenuItem as={Link} href={`#${urlSlug(title)}`} key={title}>
              {title}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}