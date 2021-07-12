import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Heading, Stack } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay
} from "@chakra-ui/modal";
import BoxHeading from "@components/@core/layout/box-heading";
import { FilterWrapper } from "@components/pages/observation/list/filters";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { ClearFilters } from "./clear-filter";
import { FiltersList } from "./filters-list";

export function Filters() {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { t } = useTranslation();
  const isDesktopFilter = useBreakpointValue({ base: false, lg: true });

  return isDesktopFilter ? (
    <Box as={FilterWrapper} gridColumn={{ lg: "1/4" }}>
      <Stack m={4} isInline={true} align="center" justify="space-between">
        <Heading size="md">{t("filters:title")}</Heading>
        <ClearFilters />
      </Stack>
      <FiltersList />
    </Box>
  ) : (
    <FilterWrapper>
      <Button w="full" className="toggle-button" onClick={onToggle}>
        {t("filters:toggle")}
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <BoxHeading>{t("filters:title")}</BoxHeading>
            <DrawerBody p={0}>{isOpen && <FiltersList />}</DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </FilterWrapper>
  );
}
