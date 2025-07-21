import TraitsShowComponent from "@components/pages/traits/show";
import { axGetTraitShowData } from "@services/traits.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const TraitShowPage = ({ data }) => <TraitsShowComponent data={data} />;
export const getServerSideProps = async (ctx) => {
  const { success, data } = await axGetTraitShowData(
    ctx.query.traitId,
    getLanguageId(ctx.locale)?.ID
  );
  return success
    ? {
        props: {
          data: data
        }
      }
    : {
        redirect: {
          permanent: false,
          destination: "/observation/list"
        }
      };
};

export default TraitShowPage;
