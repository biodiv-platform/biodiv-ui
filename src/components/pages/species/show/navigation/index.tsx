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
import { getSpeciesFieldHeaders } from "@utils/species";
import useTranslation from "next-translate/useTranslation";
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
            {t("species:synonyms")}
          </MenuItem>
          <MenuItem as={Link} href="#common-names">
            {t("species:common_names")}
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
