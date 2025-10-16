import { Box } from "@chakra-ui/react";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { convertFeatureToPolygonString, getMapCenter, stringToFeature } from "@utils/location";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";

import { mapStyles } from "@/static/constants";

const FILTER_NAME = "location";

const NakshaMaplibreDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

export default function MapDrawContainer() {
  const { filter, addFilter, removeFilter } = useDocumentFilter();
  const defaultFeatures = useMemo(() => stringToFeature(filter?.location), []);
  const defaultViewState = useMemo(() => getMapCenter(2.8), []);

  const handleOnFeatureChange = (features) => {
    if (!features.length) {
      removeFilter(FILTER_NAME);
      removeFilter("geoShapeFilterField");
      return;
    }

    const polygonString = convertFeatureToPolygonString(features[0]);

    if (polygonString) {
      addFilter(FILTER_NAME, polygonString);
      addFilter("geoShapeFilterField", "documentCoverages.topology");
    } else {
      removeFilter(FILTER_NAME);
      removeFilter("geoShapeFilterField");
    }
  };

  return (
    <Box position="relative" h="22rem">
      <NakshaMaplibreDraw
        defaultViewState={defaultViewState}
        features={defaultFeatures}
        onFeaturesChange={handleOnFeatureChange}
        mapStyles={mapStyles}
        isPolygon={true}
      />
    </Box>
  );
}
