import { Box } from "@chakra-ui/core";
import React from "react";

import Carousel from "./carousel";
import Features from "./features";
import Map from "./map";
import Partners from "./partners";
import RecentObservations from "./recent";
import Stats from "./stats";

export default function HomePageComponent({ portalStats, featured }) {
  return (
    <Box className="container" mt={[6, 6, 6, 10]}>
      <Carousel featured={featured} />
      <Stats portalStats={portalStats} />
      <RecentObservations />
      <Map />
      <Features />
      <Partners />
    </Box>
  );
}
