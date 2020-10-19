import HomePageComponent from "@components/pages/home";
import { axGroupList, axGetGroupHompageDetails } from "@services/usergroup.service";
import { absoluteUrl } from "@utils/basic";
import React from "react";
import { axGetHomeInfo } from "@services/utility.service";

function HomePage({ homeInfo }) {
  return <HomePageComponent homeInfo={homeInfo} />;
}

export async function getServerSideProps(ctx) {
  const aURL = absoluteUrl(ctx).href;
  const { currentGroup } = await axGroupList(aURL);
  const { data: homeInfo } = currentGroup?.id
    ? await axGetGroupHompageDetails(currentGroup?.id)
    : await axGetHomeInfo();

  return { props: { homeInfo } };
}

export default HomePage;
