import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import MapDrawContainer from "./map-draw-container";

/**
 * `isExpand` is used here so we can prevent unnecessary map render
 * resulting smaller bundle, faster first paint and reduced billing
 *
 */
export default function MapAreaFilter() {
  const { t } = useTranslation();

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton>
            <Box flex={1} textAlign="left">
              {t("filters:location.map.title")}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>{isExpanded && <MapDrawContainer />}</AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
