import { Box } from "@chakra-ui/core";
import SITE_CONFIG from "@configs/site-config.json";
import useTranslation from "@hooks/use-translation";
import { getMapCenter } from "@utils/location";
import { Previewer } from "naksha-components-react";
import React from "react";

const coverageToGeoJson = (coverage) => ({
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
  const defaultViewPort = React.useMemo(() => getMapCenter(2.8), []);

  return (
    <Box
      h="23rem"
      borderRadius="md"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      className="gray-box fadeInUp delay-5"
      mb={4}
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
