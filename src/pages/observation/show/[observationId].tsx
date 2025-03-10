import ObservationShowPageComponent from "@components/pages/observation/show";
import {
  axGetObservationById,
  axGetspeciesGroups,
  axGetTraitsByGroupId
} from "@services/observation.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const ObservationShowPage = ({ observation, traits, speciesGroups }) => (
  <ObservationShowPageComponent
    observation={observation}
    traits={traits}
    speciesGroups={speciesGroups}
  />
);
export const getServerSideProps = async (ctx) => {
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { success, data } = await axGetObservationById(ctx.query.observationId);
  const res = await axGetTraitsByGroupId(data?.observation?.groupId,getLanguageId(ctx.locale)?.ID );
  return success
    ? {
        props: {
          observation: data,
          traits: res.data,
          speciesGroups: speciesGroups || [],
          success
        }
      }
    : {
        redirect: {
          permanent: false,
          destination: "/observation/list"
        }
      };
};

export default ObservationShowPage;
