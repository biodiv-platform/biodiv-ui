import ObservationShowPageComponent from "@components/pages/observation/show";
import {
  axGetObservationById,
  axGetspeciesGroups,
  axGetTraitsByGroupId
} from "@services/observation.service";
import React from "react";

const ObservationShowPage = ({ observation, traits, speciesGroups }) => (
  <ObservationShowPageComponent
    observation={observation}
    traits={traits}
    speciesGroups={speciesGroups}
  />
);

ObservationShowPage.getInitialProps = async (ctx) => {
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data } = await axGetObservationById(ctx.query.observationId);
  const res = await axGetTraitsByGroupId(data.observation.groupId);
  return {
    observation: data,
    traits: res.data,
    speciesGroups
  };
};

export default ObservationShowPage;
