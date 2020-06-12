import ObservationListPageComponent from "@components/pages/observation/list";
import { ObservationFilterProvider } from "@hooks/useObservationFilter";
import { UserGroupIbp } from "@interfaces/observation";
import { axGetListData, axGetObservationListConfig } from "@services/observation.service";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { absoluteUrl } from "@utils/basic";
import React from "react";

function ObservationListPage({
  observationData,
  listConfig,
  initialFilterParams,
  nextOffset,
  traits,
  customFields
}) {
  return (
    <ObservationFilterProvider
      {...listConfig}
      filter={initialFilterParams}
      observationData={observationData}
    >
      <ObservationListPageComponent
        traits={traits}
        customFields={customFields}
        nextOffset={nextOffset}
      />
    </ObservationFilterProvider>
  );
}

ObservationListPage.config = {
  footer: false
};

ObservationListPage.getInitialProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;
  const { data: listConfig } = await axGetObservationListConfig();

  const aUrl = absoluteUrl(ctx.req).url;
  const userGroupList = listConfig.userGroup.find((group: UserGroupIbp) =>
    aUrl.includes(group.webAddress)
  )?.id;

  const initialFilterParams = { ...DEFAULT_FILTER, ...ctx.query, userGroupList };
  const { data } = await axGetListData(initialFilterParams);
  const { data: observationList } = await axGetObservationListConfig();

  return {
    observationData: {
      l: data.observationList,
      ml: data.observationListMinimal,
      ag: data.aggregationData,
      n: data.totalCount,
      mvp: {},
      hasMore: true
    },
    customFields: observationList["customFields"],
    traits: observationList["traits"],
    listConfig,
    nextOffset,
    initialFilterParams
  };
};

export default ObservationListPage;
