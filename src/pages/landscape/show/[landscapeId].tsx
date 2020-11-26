import LandscapeShowPageComponent from "@components/pages/landscape/show";
import { axGetLandscapeById, axGetLandscapeShowById } from "@services/landscape.service";
import { getLangId } from "@utils/lang";
import React from "react";

const ObservationShowPage = ({ landscape, landscapeShow }) => (
  <LandscapeShowPageComponent landscape={landscape} landscapeShow={landscapeShow} />
);

ObservationShowPage.getInitialProps = async (ctx) => {
  const langId = getLangId(ctx);
  const { data: landscape } = await axGetLandscapeById(ctx.query.landscapeId);
  const { data: landscapeShow } = await axGetLandscapeShowById(ctx.query.landscapeId, langId);
  return {
    landscape,
    landscapeShow
  };
};

export default ObservationShowPage;
