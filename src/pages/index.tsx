import HomePageComponent from "@components/pages/home";
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
  const { currentGroup } = await axGroupList(aURL);
  const { data: homeInfo } = currentGroup?.id
    ? await axGetGroupHompageDetails(currentGroup?.id)
    : await axGetHomeInfo();

  return {
    props: {
      homeInfo: {
        ...homeInfo,
        gallerySlider: Object.entries(homeInfo.gallerySlider || {}).sort((a, b) => {
          const aOrder = parseInt(a[0].split("|")[1], 10);
          const bOrder = parseInt(b[0].split("|")[1], 10);
          return aOrder - bOrder;
        })
      }
    }
  };
}

export default index;
