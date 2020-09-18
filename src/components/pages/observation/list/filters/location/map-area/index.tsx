import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
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
            <div>{t("FILTERS.LOCATION.MAP.TITLE")}</div>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>{isExpanded && <MapDrawContainer />}</AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
