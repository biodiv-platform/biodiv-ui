import TraitsShowComponent from "@components/pages/traits/show";
import useGlobalState from "@hooks/use-global-state";
import { axGetTraitShowData } from "@services/traits.service";
import React from "react";

const TraitShowPage = ({ data }) => <TraitsShowComponent data={data} />;
export const getServerSideProps = async (ctx) => {
  const { languageId } = useGlobalState();
  const { success, data } = await axGetTraitShowData(ctx.query.traitId, languageId);
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
