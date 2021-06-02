import ExternalObservationShowPageComponent from "@components/pages/observation/external-show";
import { axGetspeciesGroups, axGetExtObservationById } from "@services/observation.service";
import React from "react";

import Error from "@pages/_error";

const ExternalObservationShowPage = ({ observation, speciesGroups, success }) =>
  success ? (
    <ExternalObservationShowPageComponent observation={observation} speciesGroups={speciesGroups} />
  ) : (
    <Error statusCode={404} />
  );

export const getServerSideProps = async (ctx) => {
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { success, data } = await axGetExtObservationById(ctx.query.id);
  return {
    props: {
      observation: data,
      speciesGroups: speciesGroups || [],
      success
    }
  };
};

export default ExternalObservationShowPage;
