import LandscapeShowPageComponent, {
  LandscapeShowComponentProps
} from "@components/pages/landscape/show";
import { axGetListData } from "@services/document.service";
import { axGetLandscapeById, axGetLandscapeShowById } from "@services/landscape.service";
import { axGetListData as axGetObservationList } from "@services/observation.service";
import { DEFAULT_FILTER } from "@static/documnet-list";
import { DEFAULT_FILTER as OBSERVATION_FILTER } from "@static/observation-list";
import { getLanguageId } from "@utils/i18n";
import React from "react";
import wkt from "wkt";

const documentsListParams = {
  geoShapeFilterField: "documentCoverages.topology",
  nestedField: "documentCoverages",
  max: 6
};

const observationListParams = {
  geoShapeFilterField: "location",
  max: 6
};

const ObservationShowPage = ({
  landscape,
  landscapeShow,
  documentList,
  observationList
}: LandscapeShowComponentProps) => (
  <LandscapeShowPageComponent
    landscape={landscape}
    documentList={documentList}
    observationList={observationList}
    landscapeShow={landscapeShow}
  />
);

export const getServerSideProps = async (ctx) => {
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
  const { data: documents } = await axGetListData(initialFilterParams, { location });
  const { data: observations } = await axGetObservationList(
    { ...OBSERVATION_FILTER, ...observationListParams },
    { location }
  );
  return {
    props: {
      landscape,
      landscapeShow,
      observationList: observations?.observationList || [],
      documentList: documents?.documentList || []
    }
  };
};

export default ObservationShowPage;
