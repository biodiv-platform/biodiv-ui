import { Box, Heading } from "@chakra-ui/core";
import GeoJSONPreview from "@components/@core/map-preview/geojson";
import React from "react";

export default function MapDrawView({ neLongitude, neLatitude, swLatitude, swLongitude, title }) {
  const coverage = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [neLongitude, swLatitude],
          [swLongitude, swLatitude],
          [swLongitude, neLatitude],
          [neLongitude, neLatitude],
          [neLongitude, swLatitude]
        ]
      ]
    }
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
