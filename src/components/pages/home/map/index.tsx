import { Box } from "@chakra-ui/core";
import useOnlineStatus from "@rehooks/online-status";
import React from "react";
import LazyLoad from "react-lazyload";

import Map from "./map";

export default function MapContainer() {
  const isOnline = useOnlineStatus();

  return (
    <Box mb={10}>
      <LazyLoad height="500" once={true}>
        <Box h="500px" bg="gray.100" borderRadius="lg" className="fade" overflow="hidden">
          {isOnline && <Map />}
        </Box>
      </LazyLoad>
    </Box>
  );
}
