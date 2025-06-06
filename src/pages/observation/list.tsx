import { ObservationFilterProvider } from "@components/pages/observation/common/use-observation-filter";
import ObservationListPageComponent from "@components/pages/observation/list";
import SITE_CONFIG from "@configs/site-config";
import { axGroupList } from "@services/app.service";
import { axGetListData, axGetObservationListConfig } from "@services/observation.service";
import { axGetUserGroupMediaToggle } from "@services/usergroup.service";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { absoluteUrl } from "@utils/basic";
import React from "react";

function ObservationListPage({
  observationData,
  listConfig,
  initialFilterParams,
  nextOffset,
  includeTotals,
  totalCounts,
  topUploaders,
  topIdentifiers,
  uniqueSpecies,
  taxon,
  countPerDay,
  groupObservedOn,
  traits
}) {
  return (
    <ObservationFilterProvider
      {...listConfig}
      filter={initialFilterParams}
      observationData={observationData}
      {...(includeTotals
        ? {
            totalCounts: totalCounts,
            topUploaders: topUploaders,
            topIdentifiers: topIdentifiers,
            uniqueSpecies: uniqueSpecies,
            taxon: taxon,
            countPerDay: countPerDay,
            groupObservedOn: groupObservedOn,
            groupTraits: traits
          }
        : {})}
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
  } else if (!currentGroup.id && SITE_CONFIG.OBSERVATION.MEDIA_TOGGLE === "All") {
    CUSTOM_FILTER.mediaFilter = "no_of_images,no_of_videos,no_of_audio,no_media";
  }

  const initialFilterParams = {
    ...CUSTOM_FILTER,
    ...ctx.query,
    userGroupList: currentGroup.id
  };

  const { data } = await axGetListData(initialFilterParams, location ? { location } : {});
  const includeTotals = ctx.query.view == "stats";

  return {
    props: {
      observationData: {
        l: data.observationList,
        ml: data.observationListMinimal,
        ag: data.aggregationData,
        n: data.totalCount,
        mvp: {},
        hasMore: true,
        mediaToggle: currentGroup.id
          ? customisations.mediaToggle
          : SITE_CONFIG.OBSERVATION.MEDIA_TOGGLE
      },
      listConfig,
      nextOffset,
      initialFilterParams,
      ...(includeTotals
        ? {
            totalCounts: data.aggregateStatsData?.totalCounts ?? null,
            topUploaders: data.aggregateStatsData?.groupTopUploaders ?? [],
            topIdentifiers: data.aggregateStatsData?.groupTopIdentifiers ?? [],
            uniqueSpecies: data.aggregateStatsData?.groupUniqueSpecies ?? {},
            taxon: data.aggregateStatsData?.groupTaxon ?? [],
            countPerDay: data.aggregateStatsData?.countPerDay ?? [],
            groupObservedOn: data.aggregateStatsData?.groupObservedOn ?? [],
            traits: data.aggregateStatsData?.groupTraits ?? []
          }
        : {}),
      includeTotals: includeTotals
    }
  };
};

export default ObservationListPage;
