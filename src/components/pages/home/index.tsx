import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import useGlobalState from "@hooks/use-global-state";
import React from "react";

import Carousel from "./carousel";
import HomeDescription from "./description";
import Features from "./features";
import Map from "./map";
import Partners from "./partners";
import RecentObservations from "./recent";
import Stats from "./stats";

const { HOME } = SITE_CONFIG;

export default function HomePageComponent({ homeInfo }) {
  const { currentGroup } = useGlobalState();
  const showFeatures = !currentGroup?.id;
  return (
    <Box className="container" mt={[6, 6, 6, 10]}>
      {homeInfo.showGallery && HOME.GALLERY && homeInfo.gallerySlider.length && (
        <Carousel featured={homeInfo.gallerySlider} />
      )}
      {homeInfo.showStats && HOME.STATS && <Stats portalStats={homeInfo.stats} />}
      {homeInfo.showDesc && <HomeDescription description={homeInfo.description} />}
      {homeInfo.showRecentObservation && SITE_CONFIG.OBSERVATION.ACTIVE && <RecentObservations />}
      {homeInfo.showGridMap && SITE_CONFIG.MAP.ACTIVE && <Map />}
      {showFeatures && HOME.FEATURES && <Features />}
      {showFeatures && HOME.PARTNERS && <Partners />}
    </Box>
  );
}
