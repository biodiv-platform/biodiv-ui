import { ObservationFilterProvider } from "@components/pages/observation/common/use-observation-filter";
import ObservationListPageComponent from "@components/pages/observation/list";
import { axGroupList } from "@services/app.service";
import { axGetListData, axGetObservationListConfig } from "@services/observation.service";
import { axGetUserGroupMediaToggle } from "@services/usergroup.service";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { absoluteUrl } from "@utils/basic";
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
  const { data: listConfig } = await axGetObservationListConfig();

  const aURL = absoluteUrl(ctx).href;
  const { currentGroup } = await axGroupList(aURL);
  const { location } = ctx.query;

  const { customisations } = await axGetUserGroupMediaToggle(currentGroup.id);

  const CUSTOM_FILTER = { ...DEFAULT_FILTER };

  if (currentGroup.id && customisations.mediaToggle === "All") {
    CUSTOM_FILTER.mediaFilter = "no_of_images,no_of_videos,no_of_audio,no_media";
  }

  const initialFilterParams = {
    ...CUSTOM_FILTER,
    ...ctx.query,
    userGroupList: currentGroup.id
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
        mediaToggle: currentGroup.id ? customisations.mediaToggle : "withMedia"
      },
      listConfig,
      nextOffset,
      initialFilterParams
    }
  };
};

export default ObservationListPage;
