import { Box, Button, Heading, Stack, useBreakpointValue } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import styled from "@emotion/styled";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
  DrawerTrigger
} from "@/components/ui/drawer";

import FiltersList from "./list";
import ClearFilters from "./taxon-browser/clear-filters";

export const FilterWrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
  border-right: 1px solid var(--chakra-colors-gray-300);

  [data-accordion-item] {
    [data-accordion-panel] {
      padding: 0.75rem;
    }

    > button[aria-expanded="true"] {
      background: var(--chakra-colors-gray-100);
    }

    > button > div {
      display: flex;
      flex: 1;
    }
  }
`;

export default function Filters() {
  const { t } = useTranslation();
  const isDesktopFilter = useBreakpointValue({ base: false, lg: true });

  return isDesktopFilter ? (
    <Box as={FilterWrapper} gridColumn={{ lg: "1/4" }}>
      <Stack m={4} direction={"row"} align="center" justify="space-between">
        <Heading size="md">{t("filters:title")}</Heading>
        <ClearFilters />
      </Stack>
      <FiltersList />
    </Box>
  ) : (
    <FilterWrapper>
      <DrawerRoot placement={"end"}>
        <DrawerTrigger asChild>
          <Button w="full" className="toggle-button" variant={"subtle"}>
            {t("filters:toggle")}
          </Button>
        </DrawerTrigger>
        <DrawerBackdrop>
          <DrawerContent>
            <DrawerCloseTrigger />
            <BoxHeading>{t("filters:title")}</BoxHeading>
            <DrawerBody p={0}>{<FiltersList />}</DrawerBody>
          </DrawerContent>
        </DrawerBackdrop>
      </DrawerRoot>
    </FilterWrapper>
  );
}
