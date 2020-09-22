import HomePageComponent from "@components/pages/home";
import { axGroupList } from "@services/usergroup.service";
import { axGetHomeInfo } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import React from "react";

function HomePage({ homeInfo }) {
  return <HomePageComponent homeInfo={homeInfo} />;
}

export async function getServerSideProps(ctx) {
  const aURL = absoluteUrl(ctx).href;
  const { currentGroup } = await axGroupList(aURL);
  const { data: homeInfo } = await axGetHomeInfo(currentGroup?.id);
  return { props: { homeInfo } };
}

export default HomePage;
