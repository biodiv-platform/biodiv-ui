import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import partnersList from "@static/partners";
import sponsorsList from "@static/sponsors";
import React from "react";

import Carousel from "./carousel";
import HomeDescription from "./description";
import Features from "./features";
import Map from "./map";
import RecentObservations from "./recent";
import Stats from "./stats";
import Supporters from "./supporters";

const { HOME } = SITE_CONFIG;

export default function HomePageComponent({ homeInfo }) {
  const { currentGroup } = useGlobalState();
  const showFeatures = !currentGroup?.id;
  const { t } = useTranslation();

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
      {showFeatures && HOME.PARTNERS && (
        <Supporters
          title={t("HOME.PARTNERS")}
          list={partnersList}
          imagePrefix="/partners-images/"
        />
      )}
      {showFeatures && HOME.SPONSORS && (
        <Supporters
          title={t("HOME.SPONSORS")}
          list={sponsorsList}
          imagePrefix="/next-assets/sponsors/"
        />
      )}
    </Box>
  );
}
