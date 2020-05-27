import HomePageComponent from "@components/pages/home";
import FEATURED_IMAGES from "@configs/featured.json";
import { axGetObservationsByResources } from "@services/observation.service";
import { axGetPortalStats } from "@services/utility.service";
import React from "react";

function HomePage({ portalStats, featured }) {
  return <HomePageComponent portalStats={portalStats} featured={featured} />;
}

export async function getServerSideProps() {
  const { data: portalStats } = await axGetPortalStats();
  const { data: featured } = await axGetObservationsByResources(FEATURED_IMAGES);
  return { props: { portalStats, featured } };
}

export default HomePage;
