import { Box } from "@chakra-ui/core";
import SITE_CONFIG from "@configs/site-config.json";
import { getMapCenter } from "@utils/location";
import { Previewer } from "naksha-components-react";
import React from "react";
import { ViewportProps } from "react-map-gl";

interface GeoJSONPreviewProps {
  data: any;
  h?;
  zoom?;
  viewPort?: Partial<ViewportProps>;
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
      <Previewer
        defaultViewPort={defaultViewPort}
        data={data}
        mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
      />
    </Box>
  );
}
