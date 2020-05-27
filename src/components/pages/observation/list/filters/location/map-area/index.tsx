import { AccordionHeader, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import dynamic from "next/dynamic";
import React from "react";

const MapDrawContainer = dynamic(() => import("./map-draw-container"), { ssr: false });

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
          <AccordionHeader>
            <div>{t("FILTERS.LOCATION.MAP.TITLE")}</div>
            <AccordionIcon />
          </AccordionHeader>
          <AccordionPanel>{isExpanded && <MapDrawContainer />}</AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
