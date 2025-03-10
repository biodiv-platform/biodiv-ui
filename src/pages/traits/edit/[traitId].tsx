import { authorizedPageSSP } from "@components/auth/auth-redirect";
import TraitsEditComponent from "@components/pages/traits/edit";
import { Role } from "@interfaces/custom";
import { axGetTraitTranslationData } from "@services/traits.service";
import { axGetLangList } from "@services/utility.service";
import React from "react";

const TraitEditPage = ({ data, languagesList }) => (
  <TraitsEditComponent data={data} languages={languagesList} />
);
export const getServerSideProps = async (ctx) => {
  const { success, data } = await axGetTraitTranslationData(ctx.query.traitId);
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  const languagesList = await axGetLangList();
  return success
    ? redirect || {
        props: {
          data: data,
          languagesList: languagesList.data
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
