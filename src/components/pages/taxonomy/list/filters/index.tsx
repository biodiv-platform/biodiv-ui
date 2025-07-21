import { Box, Button, Heading, Stack, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import { FilterWrapper } from "@components/pages/observation/list/filters";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot
} from "@/components/ui/drawer";

import { ClearFilters } from "./clear-filter";
import { FiltersList } from "./filters-list";

export function Filters() {
  const { open, onToggle, onClose } = useDisclosure();
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
      <Button w="full" className="toggle-button" onClick={onToggle} variant={"subtle"}>
        {t("filters:toggle")}
      </Button>
      <DrawerRoot open={open} placement="end" onOpenChange={onClose}>
        <DrawerBackdrop>
          <DrawerContent>
            <DrawerCloseTrigger />
            <BoxHeading>{t("filters:title")}</BoxHeading>
            <DrawerBody p={0}>{open && <FiltersList />}</DrawerBody>
          </DrawerContent>
        </DrawerBackdrop>
      </DrawerRoot>
    </FilterWrapper>
  );
}
