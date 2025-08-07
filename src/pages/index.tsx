import HomePageComponent from "@components/pages/home";
import SITE_CONFIG from "@configs/site-config";
import { axGroupList } from "@services/app.service";
import { axGetGroupHompageDetails } from "@services/usergroup.service";
import { axGetHomeInfo } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import { getLanguageId } from "@utils/i18n";
import React from "react";

function index({ homeInfo }) {
  return <HomePageComponent homeInfo={homeInfo} />;
}

export async function getServerSideProps(ctx) {
  const aURL = absoluteUrl(ctx).href;
  const { currentGroup } = await axGroupList(
    aURL,
    getLanguageId(ctx.locale)?.ID ?? SITE_CONFIG.LANG.DEFAULT_ID
  );
  const { data: homeInfo } = currentGroup?.groupId
    ? await axGetGroupHompageDetails(
        currentGroup?.groupId,
        getLanguageId(ctx.locale)?.ID ?? SITE_CONFIG.LANG.DEFAULT_ID
      )
    : await axGetHomeInfo();

  const updatedMiniGallery = homeInfo?.miniGallerySlider?.map((item) => {
    const sortedGallerySlider = Object.entries(item).sort((a, b) => {
      const aOrder = parseInt(a[0].split("|")[1], 10);
      const bOrder = parseInt(b[0].split("|")[1], 10);
      return aOrder - bOrder;
    });

    return sortedGallerySlider;
  });

  return {
    props: {
      homeInfo: {
        ...homeInfo,
        gallerySlider: Object.entries(homeInfo.gallerySlider || {}).sort((a, b) => {
          const aOrder = parseInt(a[0].split("|")[1], 10);
          const bOrder = parseInt(b[0].split("|")[1], 10);
          return aOrder - bOrder;
        }),
        miniGallerySlider: updatedMiniGallery,
        miniGallery: Object.entries(homeInfo?.miniGallery)
      }
    }
  };
}

export default index;
