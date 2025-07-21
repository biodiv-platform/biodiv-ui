import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import MapDrawContainer from "./map-draw-container";

/**
 * `isExpand` is used here so we can prevent unnecessary map render
 * resulting smaller bundle, faster first paint and reduced billing
 *
 */
export default function MapAreaFilter() {
  const { t } = useTranslation();

  return (
    <AccordionItem value="map" pl={4}>
      <AccordionItemTrigger pr={4}>
        <Box flex={1} textAlign="left">
          {t("filters:location.map.title")}
        </Box>
      </AccordionItemTrigger>
      <AccordionItemContent>{<MapDrawContainer />}</AccordionItemContent>
    </AccordionItem>
  );
}
