import TraitsShowComponent from "@components/pages/traits/show";
import SITE_CONFIG from "@configs/site-config";
import { axGetTraitShowData } from "@services/traits.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const TraitShowPage = ({ data }) => <TraitsShowComponent data={data}/>;
export const getServerSideProps = async (ctx) => {
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;
  const { success, data } = await axGetTraitShowData(ctx.query.traitId, langId);
  return success
  ?{
    props: {
      data : data
    }
  } : {
    redirect: {
      permanent: false,
      destination: "/observation/list"
    }
  };
};

export default TraitShowPage;
