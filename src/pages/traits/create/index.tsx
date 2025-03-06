import { authorizedPageSSP } from "@components/auth/auth-redirect";
import TraitsCreateComponent from "@components/pages/traits/create";
import SITE_CONFIG from "@configs/site-config";
import { Role } from "@interfaces/custom";
import { axGetAllFieldsMeta } from "@services/species.service";
import { axGetLangList } from "@services/utility.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const traitsCreate = ({speciesField, languagesList, langId}) => (
  <TraitsCreateComponent speciesField={speciesField} languages={languagesList} langId={langId} />
);

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;
  const languagesList = await axGetLangList();

  const fieldsMeta = await axGetAllFieldsMeta({ langId });

  return redirect || {
    props: {
      speciesField: fieldsMeta.data
        .map((item) => item.childField)
        .filter((item) => item.length > 0)
        .flat(),
      languagesList: languagesList.data,
      langId: langId
    }
  };
};

export default traitsCreate;
