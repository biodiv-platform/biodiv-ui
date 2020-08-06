import { Box } from "@chakra-ui/core";
import { defaultViewPort } from "@components/pages/group/common/area-draw-field";
import useTranslation from "@configs/i18n/useTranslation";
import SITE_CONFIG from "@configs/site-config.json";
import { Previewer } from "naksha-components-react";
import React from "react";

export const coverageToGeoJson = (coverage) => ({
  type: "FeatureCollection",
  features: coverage.map(({ topology }) => ({
    type: "Feature",
    properties: {},
    geometry: topology
  }))
});

export default function DocumentSidebarMap({ documentCoverages }) {
  const geojson = coverageToGeoJson(documentCoverages);
  const { t } = useTranslation();

  return (
    <Box
      h="23rem"
      borderRadius="md"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      className="gray-box fadeInUp delay-5"
    >
      {documentCoverages.length ? (
        <Previewer
          data={geojson}
          defaultViewPort={defaultViewPort}
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
        />
      ) : (
        t("DOCUMENT.NO_GEODATA")
      )}
    </Box>
  );
}
