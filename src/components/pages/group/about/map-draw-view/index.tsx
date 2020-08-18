import { Box, Heading } from "@chakra-ui/core";
import WktPreview from "@components/@core/WKT/wkt-preview";
import { stringToFeature } from "@utils/location";
import React, { useMemo } from "react";

export default function MapDrawView({ coordinates, title }) {
  const defaultFeatures = useMemo(() => stringToFeature(coordinates), []);
  return (
    <Box mb={5}>
      <Heading m={3} size="lg">
        {title}
      </Heading>
      <Box position="relative" h="22rem" borderRadius="md" overflow="hidden">
        <WktPreview data={defaultFeatures[0]} />
      </Box>
    </Box>
  );
}
