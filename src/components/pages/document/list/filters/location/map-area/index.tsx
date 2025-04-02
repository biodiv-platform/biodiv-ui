import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";

import MapDrawContainer from "./map-draw-container";

export default function MapAreaFilter() {
  const { t } = useTranslation();

  return (
    <AccordionRoot multiple={true} lazyMount>
      <AccordionItem value={"map"} pl={4}>
        <AccordionItemTrigger>
          <Box flex={1} textAlign="left">
            {t("filters:location.map.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>{<MapDrawContainer />}</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
