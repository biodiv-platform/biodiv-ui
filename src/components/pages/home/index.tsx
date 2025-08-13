import { Box, Heading } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import donorsList from "@static/donors";
import partnersList from "@static/partners";
import sponsorsList from "@static/sponsors";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import Carousel from "./carousel";
import VerticalCarousel from "./carousel/vertical";
import HomeDescription from "./description";
import Features from "./features";
import Map from "./map";
import RecentObservations from "./recent";
import Stats from "./stats";
import Supporters from "./supporters";

const { HOME, LANG } = SITE_CONFIG;

export default function HomePageComponent({ homeInfo }) {
  const { currentGroup, languageId } = useGlobalState();
  const showFeatures = !currentGroup?.id;

  const { t } = useTranslation();
  return (
    <Box className="container" mt={[6, 6, 6, 10]}>
      {homeInfo?.showGallery &&
        Array.isArray(homeInfo.gallerySlider) &&
        homeInfo.gallerySlider.length > 0 && (
          <Carousel featured={homeInfo.gallerySlider} mini={false} />
        )}
      {homeInfo.miniGallery &&
        homeInfo.miniGallery.map((item, index) => (
          <>
            <Heading as="h2" fontSize="2rem">
              {item[1]?.[languageId]?.[0].title ||
                item[1]?.[SITE_CONFIG.LANG.DEFAULT_ID]?.[0].title}
            </Heading>
            {item[1][LANG.DEFAULT_ID][0].isVertical ? (
              <VerticalCarousel
                featured={homeInfo.miniGallerySlider[index]}
                slidesPerView={item[1][LANG.DEFAULT_ID][0].slidesPerView}
              />
            ) : (
              <Carousel
                featured={homeInfo.miniGallerySlider[index]}
                mini={true}
                slidesPerView={item[1][LANG.DEFAULT_ID][0].slidesPerView}
              />
            )}
          </>
        ))}
      {homeInfo.showStats && HOME.STATS && <Stats portalStats={homeInfo.stats} />}
      {homeInfo.showDesc && <HomeDescription description={homeInfo.description} />}
      {homeInfo.showRecentObservation && SITE_CONFIG.OBSERVATION.ACTIVE && <RecentObservations />}
      {homeInfo.showGridMap && SITE_CONFIG.MAP.ACTIVE && SITE_CONFIG.HOME.MAP && <Map />}
      {showFeatures && HOME.FEATURES && <Features />}
      {showFeatures && homeInfo.showPartners && (
        <Supporters
          title={t("home:partners")}
          list={partnersList}
          imagePrefix="/partners-images/"
        />
      )}
      {showFeatures && homeInfo.showSponsors && (
        <Supporters
          title={t("home:sponsors")}
          list={sponsorsList}
          imagePrefix="/next-assets/sponsors/"
        />
      )}
      {showFeatures && homeInfo.showDonors && (
        <Supporters title={t("home:donors")} list={donorsList} imagePrefix="/donors-images/" />
      )}
    </Box>
  );
}
