import { Box, GridItem, Heading, Skeleton, Spinner, useBreakpointValue } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function FilterFallback() {
  const { t } = useTranslation();
  const isDesktopFilter = useBreakpointValue({ base: false, lg: true });

  return isDesktopFilter ? (
    <GridItem overflowY="scroll" w="full" colSpan={3}>
      <Box p={4}>
        <Heading size="md">{t("filters:title")}</Heading>
      </Box>
      <Spinner m={4} />
    </GridItem>
  ) : (
    <Skeleton h="40px" />
  );
}
