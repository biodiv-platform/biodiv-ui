import { Box } from "@chakra-ui/core";
import useOnlineStatus from "@rehooks/online-status";
import React from "react";
import LazyLoad from "react-lazyload";

import Map from "./map";

export default function MapContainer() {
  const isOnline = useOnlineStatus();

  return (
    <LazyLoad height="500" once={true}>
      <Box h="500px" bg="gray.100" borderRadius="lg" className="fadeInUp" mb={10} overflow="hidden">
        {isOnline ? <Map /> : null}
      </Box>
    </LazyLoad>
  );
}
