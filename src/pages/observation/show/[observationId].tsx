import ObservationShowPageComponent from "@components/pages/observation/show";
import {
  axGetObservationById,
  axGetspeciesGroups,
  axGetTraitsByGroupId
} from "@services/observation.service";
import React from "react";

import Error from "../../_error";

const ObservationShowPage = ({ observation, traits, speciesGroups, success }) =>
  success ? (
    <ObservationShowPageComponent
      observation={observation}
      traits={traits}
      speciesGroups={speciesGroups}
    />
  ) : (
    <Error statusCode={404} />
  );

export const getServerSideProps = async (ctx) => {
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { success, data } = await axGetObservationById(ctx.query.observationId);
  const res = await axGetTraitsByGroupId(data?.observation?.groupId);
  return {
    props: {
      observation: data,
      traits: res.data,
      speciesGroups,
      success
    }
  };
};

export default ObservationShowPage;
