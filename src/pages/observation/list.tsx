import ObservationListPageComponent from "@components/pages/observation/list";
import { ObservationFilterProvider } from "@hooks/useObservationFilter";
import { axGetListData, axGetObservationListConfig } from "@services/observation.service";
import { axGroupList } from "@services/usergroup.service";
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

ObservationListPage.getInitialProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;
  const { data: listConfig } = await axGetObservationListConfig();

  const aURL = absoluteUrl(ctx.req).href;
  const { currentGroup } = await axGroupList(aURL);

  const initialFilterParams = { ...DEFAULT_FILTER, ...ctx.query, userGroupList: currentGroup.id };
  const { data } = await axGetListData(initialFilterParams);

  return {
    observationData: {
      l: data.observationList,
      ml: data.observationListMinimal,
      ag: data.aggregationData,
      n: data.totalCount,
      mvp: {},
      hasMore: true
    },
    listConfig,
    nextOffset,
    initialFilterParams
  };
};

export default ObservationListPage;
