import { Box } from "@chakra-ui/core";
import { defaultViewPort } from "@components/pages/group/common/area-draw-field";
import SITE_CONFIG from "@configs/site-config.json";
import { Previewer } from "naksha-components-react";
import React from "react";
import { ViewportProps } from "react-map-gl";

interface GeoJSONPreviewProps {
  data: any;
  h?;
  maxZoom?;
  viewPort?: Partial<ViewportProps>;
  mb?: number;
}

export default function GeoJSONPreview({
  data,
  h = "22rem",
  viewPort = {},
  mb
}: GeoJSONPreviewProps) {
  return (
    <Box position="relative" h={h} borderRadius="md" overflow="hidden" mb={mb}>
      <Previewer
        defaultViewPort={{ ...defaultViewPort, ...viewPort }}
        data={data}
        mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
      />
    </Box>
  );
}
