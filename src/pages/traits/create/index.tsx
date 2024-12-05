import TraitsCreateComponent from "@components/pages/traits/create";
import SITE_CONFIG from "@configs/site-config";
import { axGetAllFieldsMeta } from "@services/species.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const traitsCreate = (speciesField) => <TraitsCreateComponent speciesField={speciesField} />;

export const getServerSideProps = async (ctx) => {
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;

  const fieldsMeta = await axGetAllFieldsMeta({ langId });

  return {
    props: {
      speciesField: fieldsMeta.data
        .map((item) => item.childField)
        .filter((item) => item.length > 0)
        .flat()
    }
  };
};

export default traitsCreate;
