import { Box } from "@chakra-ui/core";
import { useStoreState } from "easy-peasy";
import React from "react";

import Carousel from "./carousel";
import HomeDescription from "./description";
import Features from "./features";
import Map from "./map";
import Partners from "./partners";
import RecentObservations from "./recent";
import Stats from "./stats";

export default function HomePageComponent({ homeInfo }) {
  const showFeatures = !useStoreState((s) => s?.currentGroup?.id);

  return (
    <Box className="container" mt={[6, 6, 6, 10]}>
      {homeInfo.showGallery && <Carousel featured={homeInfo.gallerySlider} />}
      {homeInfo.showStats && <Stats portalStats={homeInfo.stats} />}
      {homeInfo.ugDescription && <HomeDescription description={homeInfo.ugDescription} />}
      {homeInfo.showRecentObs && <RecentObservations />}
      {homeInfo.showGridMap && <Map />}
      {showFeatures && <Features />}
      {showFeatures && <Partners />}
    </Box>
  );
}
