import LandscapeShowPageComponent from "@components/pages/landscape/show";
import { observationListParams } from "@components/pages/landscape/show/common/observation-list";
import { ObservationFilterProvider } from "@components/pages/observation/common/use-observation-filter";
import { axGetListData } from "@services/document.service";
import { axGetLandscapeById, axGetLandscapeShowById } from "@services/landscape.service";
import {
  axGetListData as axGetObservationList,
  axGetObservationListConfig
} from "@services/observation.service";
import { DEFAULT_FILTER } from "@static/documnet-list";
import { DEFAULT_FILTER as OBSERVATION_FILTER } from "@static/observation-list";
import { getLanguageId } from "@utils/i18n";
import React from "react";
import wkt from "wkt";

export const documentsListParams = {
  geoShapeFilterField: "documentCoverages.topology",
  nestedField: "documentCoverages",
  max: 6
};

const ObservationShowPage = ({
  landscape,
  landscapeShow,
  documentList,
  observationData,
  listConfig,
  initialParamsObservation
}) => (
  <ObservationFilterProvider
    {...listConfig}
    filter={initialParamsObservation}
    observationData={observationData}
  >
    <LandscapeShowPageComponent
      landscape={landscape}
      documentList={documentList}
      landscapeShow={landscapeShow}
    />
  </ObservationFilterProvider>
);

export const getServerSideProps = async (ctx) => {
  const { data: listConfig } = await axGetObservationListConfig();
  const langId = getLanguageId(ctx.locale)?.ID;
  const { data: landscape } = await axGetLandscapeById(ctx.query.landscapeId);
  const { data: landscapeShow } = await axGetLandscapeShowById(ctx.query.landscapeId, langId);
  const coord = wkt.parse(landscapeShow.wktData)?.coordinates;
  const location = Array.isArray(coord)
    ? coord.reduce((acc, item, index, arr) => {
        const str = index < arr.length - 1 ? `${item}/` : `${item}`;
        return acc.concat(str.replace(/[[\]]/g, ""));
      }, "")
    : `${coord}`.replace(/[[\]]/g, "");
  const initialFilterParams = { ...DEFAULT_FILTER, ...documentsListParams };
  const initialParamsObservation = {
    ...OBSERVATION_FILTER,
    ...observationListParams,
    view: "stats"
  };
  const { data: documents } = await axGetListData(initialFilterParams, { location });
  const { data: observations } = await axGetObservationList(initialParamsObservation, { location });
  return {
    props: {
      landscape,
      landscapeShow,
      observationData: {
        l: observations.observationList || [],
        ml: observations.observationListMinimal || [],
        ag: observations?.aggregationData || {},
        n: observations?.totalCount || {},
        mvp: {},
        hasMore: true
      },
      documentList: documents?.documentList || [],
      location,
      listConfig: { ...listConfig, location },
      initialParamsObservation
    }
  };
};

export default ObservationShowPage;
