import TraitsEditComponent from "@components/pages/traits/edit";
import { axGetTraitShowData } from "@services/traits.service";
import React from "react";

const TraitEditPage = ({ data }) => <TraitsEditComponent data={data} />;
export const getServerSideProps = async (ctx) => {
  const { success, data } = await axGetTraitShowData(ctx.query.traitId);
  return success
    ? {
        props: {
          data: data
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
