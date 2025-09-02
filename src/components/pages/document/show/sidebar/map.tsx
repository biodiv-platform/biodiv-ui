import { Box } from "@chakra-ui/react";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const NakshaMaplibreView: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreView),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const coverageToGeoJson = (coverage) => ({
  type: "FeatureCollection",
  features: coverage?.map(({ topology }) => ({
    type: "Feature",
    properties: {},
    geometry: topology
  }))
});

export default function DocumentSidebarMap({ documentCoverages }) {
  const geojson = coverageToGeoJson(documentCoverages);
  const { t } = useTranslation();
  const defaultViewState = React.useMemo(() => getMapCenter(2.8), []);

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
      {documentCoverages?.length ? (
        <NakshaMaplibreView
          data={geojson}
          defaultViewState={defaultViewState}
          // mapboxAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
        />
      ) : (
        t("document:no_geodata")
      )}
    </Box>
  );
}
