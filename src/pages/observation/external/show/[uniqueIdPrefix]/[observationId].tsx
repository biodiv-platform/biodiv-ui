import ExternalObservationShowPageComponent from "@components/pages/observation/external-show";
import {
  axGetObservationById,
  axGetspeciesGroups,
  axGetTraitsByGroupId,
  axGetExtObservationById
} from "@services/observation.service";
import React from "react";

import Error from "@pages/_error";

const ExternalObservationShowPage = ({ observation, traits, speciesGroups, success }) =>
  success ? (
    <ExternalObservationShowPageComponent
      observation={observation}
      traits={traits}
      speciesGroups={speciesGroups}
    />
  ) : (
    <Error statusCode={404} />
  );

export const getServerSideProps = async (ctx) => {
  console.log(ctx.query);
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { success, data } = await axGetExtObservationById(
    ctx.query.uniqueIdPrefix + "-" + ctx.query.observationId
  );
  const res = await axGetTraitsByGroupId(data?.observation?.groupId);
  return {
    props: {
      observation: data,
      traits: res.data,
      speciesGroups: speciesGroups || [],
      success
    }
  };
};

export default ExternalObservationShowPage;
