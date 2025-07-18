import { ObservationFilterProvider } from "@components/pages/observation/common/use-observation-filter";
import ObservationListPageComponent from "@components/pages/observation/list";
import SITE_CONFIG from "@configs/site-config";
import { axGroupList } from "@services/app.service";
import { axGetListData } from "@services/observation.service";
import { axGetUserGroupMediaToggle } from "@services/usergroup.service";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { absoluteUrl } from "@utils/basic";
import { getLanguageId } from "@utils/i18n";
import React from "react";

function ObservationListPage({ observationData, listConfig, initialFilterParams, nextOffset }) {
  return (
    <ObservationFilterProvider
      {...listConfig}
      filter={initialFilterParams}
      observationData={observationData}
    >
      <ObservationListPageComponent nextOffset={nextOffset} />
    </ObservationFilterProvider>
  );
}

ObservationListPage.config = {
  footer: false
};

export const getServerSideProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;

  const aURL = absoluteUrl(ctx).href;
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;
  const { currentGroup } = await axGroupList(aURL, langId);
  const { location } = ctx.query;

  const { customisations } = await axGetUserGroupMediaToggle(currentGroup.groupId);

  const CUSTOM_FILTER = { ...DEFAULT_FILTER };

  if (currentGroup.groupId && customisations.mediaToggle === "All") {
    CUSTOM_FILTER.mediaFilter = "no_of_images,no_of_videos,no_of_audio,no_media";
  } else if (!currentGroup.groupId && SITE_CONFIG.OBSERVATION.MEDIA_TOGGLE === "All") {
    CUSTOM_FILTER.mediaFilter = "no_of_images,no_of_videos,no_of_audio,no_media";
  }

  const initialFilterParams = {
    ...CUSTOM_FILTER,
    ...ctx.query,
    userGroupList: currentGroup.groupId
  };

  const { data } = await axGetListData(initialFilterParams, location ? { location } : {});

  return {
    props: {
      observationData: {
        l: data.observationList,
        ml: data.observationListMinimal,
        ag: data.aggregationData,
        n: data.totalCount,
        mvp: {},
        hasMore: true,
        mediaToggle: currentGroup.groupId
          ? customisations.mediaToggle
          : SITE_CONFIG.OBSERVATION.MEDIA_TOGGLE
      },
      nextOffset,
      initialFilterParams
    }
  };
};

export default ObservationListPage;
