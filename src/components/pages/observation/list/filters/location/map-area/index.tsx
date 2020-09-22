import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/core";
import useTranslation from "@hooks/use-translation";
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
              {t("FILTERS.LOCATION.MAP.TITLE")}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>{isExpanded && <MapDrawContainer />}</AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
