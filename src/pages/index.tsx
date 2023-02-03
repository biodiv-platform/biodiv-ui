import HomePageComponent from "@components/pages/home";
import { axGetLayerCount } from "@services/api.service";
import { axGroupList } from "@services/app.service";
import { axGetGroupHompageDetails } from "@services/usergroup.service";
import { axGetHomeInfo } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import React from "react";

function index({ homeInfo }) {
  return <HomePageComponent homeInfo={homeInfo} />;
}

export async function getServerSideProps(ctx) {
  const aURL = absoluteUrl(ctx).href;
  const { success, count } = await axGetLayerCount();

  const { currentGroup } = await axGroupList(aURL);
  const { data: homeInfo } = currentGroup?.id
    ? await axGetGroupHompageDetails(currentGroup?.id)
    : success
    ? await axGetHomeInfo(count)
    : await axGetHomeInfo();

  return {
    props: {
      homeInfo: {
        ...homeInfo,
        gallerySlider: homeInfo.gallerySlider?.sort((a, b) => a.displayOrder - b.displayOrder)
      }
    }
  };
}

export default index;
