import { Box } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { getMapCenter, stringToFeature } from "@utils/location";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";

const FILTER_NAME = "location";

const NakshaMaplibreDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

export default function MapDrawContainer() {
  const { filter, addFilter, removeFilter } = useObservationFilter();
  const defaultFeatures = useMemo(() => stringToFeature(filter?.location), []);
  const defaultViewState = useMemo(() => getMapCenter(2.8), []);

  const handleOnFeatureChange = (features) => {
    if (features.length > 0) {
      addFilter(FILTER_NAME, features[0]?.geometry?.coordinates.toString());
      addFilter("geoShapeFilterField", "location");
      return;
    }
    removeFilter(FILTER_NAME);
    removeFilter("geoShapeFilterField");
  };

  return (
    <Box position="relative" h="22rem">
      <NakshaMaplibreDraw
        defaultViewState={defaultViewState}
        features={defaultFeatures}
        // mapboxAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
        onFeaturesChange={handleOnFeatureChange}
        onReady={(ctrl) => {
          const td = ctrl.getTerraDrawInstance?.();
          td?.on("change", (features) => handleOnFeatureChange(features));
        }}
      />
    </Box>
  );
}
