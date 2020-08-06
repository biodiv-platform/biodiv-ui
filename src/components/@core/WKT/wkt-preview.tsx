import { Box } from "@chakra-ui/core";
import { defaultViewPort } from "@components/pages/group/common/area-draw-field";
import SITE_CONFIG from "@configs/site-config.json";
import { Previewer } from "naksha-components-react";
import React from "react";

export default function WktPreview({ data }) {
  return (
    <Box position="relative" h="22rem" borderRadius="md" overflow="hidden">
      <Previewer
        defaultViewPort={defaultViewPort}
        data={data}
        mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
      />
    </Box>
  );
}
