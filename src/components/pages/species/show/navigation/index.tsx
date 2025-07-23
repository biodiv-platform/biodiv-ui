import { Box, IconButton, Menu, Portal, useToken } from "@chakra-ui/react";
import { getSpeciesFieldHeaders } from "@utils/species";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuMenu } from "react-icons/lu";
import urlSlug from "url-slug";

import useSpecies from "../use-species";

export default function SpeciesNavigation() {
  const { t } = useTranslation();
  const { species } = useSpecies();
  const fieldHeaders = getSpeciesFieldHeaders(species.fieldData);
  const [zIndicesSticky] = useToken("zIndices", ["sticky"]);

  return (
    <Box position="sticky" top="0" h={0} zIndex={zIndicesSticky}>
      <Menu.Root>
        <Menu.Trigger m={1} aria-label="Options" asChild>
          <IconButton variant={"subtle"}>
            <LuMenu />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="#synonyms" asChild>
                <Link href="#synonyms">{t("species:synonyms")}</Link>
              </Menu.Item>

              <Menu.Item value="#common-names" asChild>
                <Link href="#common-names">{t("species:common_names")}</Link>
              </Menu.Item>

              {fieldHeaders.map(({ header }) => (
                <Menu.Item value={`#${urlSlug(header)}`} asChild>
                  <Link href={`#${urlSlug(header)}`}>{header}</Link>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
}
