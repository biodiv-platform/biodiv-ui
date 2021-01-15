import LandscapeShowPageComponent from "@components/pages/landscape/show";
import { axGetLandscapeById, axGetLandscapeShowById } from "@services/landscape.service";
import { getLangId } from "@utils/lang";
import React from "react";
import { DEFAULT_FILTER } from "@static/documnet-list";
import wkt from "wkt";
import { axGetListData } from "@services/document.service";

const ShowLandScapeParams = {
  geoShapeFilterField: "documentCoverages.topology",
  nestedField: "documentCoverages",
  max: 6
};

const ObservationShowPage = ({ landscape, landscapeShow, documentList }) => (
  <LandscapeShowPageComponent
    landscape={landscape}
    documentList={documentList}
    landscapeShow={landscapeShow}
  />
);

ObservationShowPage.getInitialProps = async (ctx) => {
  const langId = getLangId(ctx);
  const { data: landscape } = await axGetLandscapeById(ctx.query.landscapeId);
  const { data: landscapeShow } = await axGetLandscapeShowById(ctx.query.landscapeId, langId);
  const coord = wkt.parse(landscapeShow.wktData)?.coordinates;
  const location = Array.isArray(coord)
    ? coord.reduce((acc, item, index, arr) => {
        const str = index < arr.length - 1 ? `${item}/` : `${item}`;
        return acc.concat(str.replace(/[[\]]/g, ""));
      }, "")
    : `${coord}`.replace(/[[\]]/g, "");
  const initialFilterParams = { ...DEFAULT_FILTER, ...ShowLandScapeParams };
  const { data: documents } = await axGetListData(initialFilterParams, { location });
  return {
    landscape,
    landscapeShow,
    documentList: documents?.documentList || []
  };
};

export default ObservationShowPage;
