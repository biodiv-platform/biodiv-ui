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
}

export default function GeoJSONPreview({ data, h = "22rem", viewPort = {} }: GeoJSONPreviewProps) {
  return (
    <Box position="relative" h={h} borderRadius="md" overflow="hidden">
      <Previewer
        defaultViewPort={{ ...defaultViewPort, ...viewPort }}
        data={data}
        mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
      />
    </Box>
  );
}
