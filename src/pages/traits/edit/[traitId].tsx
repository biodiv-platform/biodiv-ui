import { authorizedPageSSP } from "@components/auth/auth-redirect";
import TraitsEditComponent from "@components/pages/traits/edit";
import SITE_CONFIG from "@configs/site-config";
import { Role } from "@interfaces/custom";
import { axGetTraitTranslationData } from "@services/traits.service";
import { axGetLangList } from "@services/utility.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const TraitEditPage = ({ data, languagesList, langId }) => (
  <TraitsEditComponent data={data} languages={languagesList} langId={langId} />
);
export const getServerSideProps = async (ctx) => {
  const { success, data } = await axGetTraitTranslationData(ctx.query.traitId);
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  const languagesList = await axGetLangList();
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;
  return success
    ? redirect || {
        props: {
          data: data,
          languagesList: languagesList.data,
          langId: langId
        }
      }
    : {
        redirect: {
          permanent: false,
          destination: `/traits/show/${ctx.query.traitId}`
        }
      };
};
export default TraitEditPage;
