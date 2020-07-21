import { Box } from "@chakra-ui/core";
import SITE_CONFIG from "@configs/site-config.json";
import useObservationFilter from "@hooks/useObservationFilter";
import { stringToFeature } from "@utils/location";
import { MapAreaDraw } from "naksha-components-react";
import React, { useMemo } from "react";

const defaultViewPort = {
  ...SITE_CONFIG.MAP.CENTER,
  zoom: 2.8,
  bearing: 0,
  pitch: 0
};

const FILTER_NAME = "location";

export default function MapDrawContainer() {
  const { filter, addFilter, removeFilter } = useObservationFilter();
  const defaultFeatures = useMemo(() => stringToFeature(filter?.location), []);

  const handleOnFeatureChange = (features) => {
    if (features.length > 0) {
      addFilter(FILTER_NAME, features[0]?.geometry?.coordinates.toString());
      return;
    }
    removeFilter(FILTER_NAME);
  };

  return (
    <Box position="relative" h="22rem">
      <MapAreaDraw
        defaultViewPort={defaultViewPort}
        defaultFeatures={defaultFeatures}
        mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
        onFeaturesChange={handleOnFeatureChange}
        isPolygon={true}
      />
    </Box>
  );
}
