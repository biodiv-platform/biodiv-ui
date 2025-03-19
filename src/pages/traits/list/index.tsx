import TraitsListComponent from "@components/pages/traits/list";
import { axGetTraitListData } from "@services/traits.service";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const traitsCreate = ({ data, filter }) => <TraitsListComponent data={data} filterKey={filter} />;

export const getServerSideProps = async (ctx) => {
  const { data: traits } = await axGetTraitListData(getLanguageId(ctx.locale)?.ID);

  return {
    props: {
      data: traits,
      filter: ctx.query.filter ?? "All"
    }
  };
};

export default traitsCreate;
