import ObservationShowPageComponent from "@components/pages/observation/show";
import SITE_CONFIG from "@configs/site-config";
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
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;
  const res = await axGetTraitsByGroupId(data?.observation?.groupId,langId );
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
