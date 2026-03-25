import React from "react";

import ElasticComponent from "@/components/pages/manage/elastic";
import { ObservationListProvider } from "@/components/pages/manage/elastic/use-observation-filter";

function ObservationList({ initialFilterParams }) {
  return (
    <ObservationListProvider filter={initialFilterParams}>
      <ElasticComponent />
    </ObservationListProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  const initialFilterParams = {
    ...ctx.query,
    max: 15,
    offset: 0
  };

  return {
    props: {
      initialFilterParams
    }
  };
};

export default ObservationList;
