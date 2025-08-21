import { Box, Heading } from "@chakra-ui/react";
import GeoJSONPreview from "@components/@core/map-preview/geojson";
import React from "react";

export default function MapDrawView({ geometry, title }) {
  const coverage = {
    type: "Feature",
    properties: {},
    geometry: geometry
  };

  return (
    <Box mb={6}>
      <Heading size="lg" as="h2" mb={4}>
        {title}
      </Heading>
      <GeoJSONPreview data={coverage} />
    </Box>
  );
}
