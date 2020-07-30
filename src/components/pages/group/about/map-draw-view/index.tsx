import { Box, Heading } from "@chakra-ui/core";
import SITE_CONFIG from "@configs/site-config.json";
import { stringToFeature } from "@utils/location";
import { MapAreaDraw } from "naksha-components-react";
import React, { useMemo } from "react";

const defaultViewPort = {
  ...SITE_CONFIG.MAP.CENTER,
  zoom: 2.8,
  bearing: 0,
  pitch: 0
};

export default function MapDrawView({ coordinates, title }) {
  const defaultFeatures = useMemo(() => stringToFeature(coordinates), []);

  return (
    <Box mb={5}>
      <Heading m={3} size="lg">
        {title}
      </Heading>
      <Box position="relative" h="22rem" borderRadius="md" overflow="hidden">
        <MapAreaDraw
          defaultViewPort={defaultViewPort}
          defaultFeatures={defaultFeatures}
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          isPolygon={false}
        />
      </Box>
    </Box>
  );
}
