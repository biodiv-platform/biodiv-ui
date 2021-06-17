import LandscapeShowPageComponent from "@components/pages/landscape/show";
import { axGetListData } from "@services/document.service";
import { axGetLandscapeById, axGetLandscapeShowById } from "@services/landscape.service";
import { DEFAULT_FILTER } from "@static/documnet-list";
import { getLanguageId } from "@utils/i18n";
import React from "react";
import wkt from "wkt";

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
  const initialFilterParams = { ...DEFAULT_FILTER, ...ShowLandScapeParams };
  const { data: documents } = await axGetListData(initialFilterParams, { location });

  return {
    props: {
      landscape,
      landscapeShow,
      documentList: documents?.documentList || []
    }
  };
};

export default ObservationShowPage;
