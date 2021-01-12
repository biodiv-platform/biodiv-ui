import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import React from "react";

const NakshaMapboxView: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxView),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);
interface GeoJSONPreviewProps {
  data: any;
  h?;
  zoom?;
  viewPort?;
  mb?: number;
  maxZoom?: number;
}

export default function GeoJSONPreview({
  data,
  h = "22rem",
  zoom,
  maxZoom,
  mb
}: GeoJSONPreviewProps) {
  const defaultViewPort = React.useMemo(() => getMapCenter(zoom || 2.8, maxZoom), []);
  return (
    <Box position="relative" h={h} overflow="hidden" mb={mb} borderRadius="md">
      <NakshaMapboxView
        defaultViewPort={defaultViewPort}
        data={data}
        mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
      />
    </Box>
  );
}
