import LandscapeListComponent from "@components/pages/landscape/list";
import { LandscapeFilterProvider } from "@components/pages/landscape/list/use-landscape-filter";
import { axGetDocumentListData } from "@services/landscape.service";
import { LANDSCAPE_DEFAULT_FILTER } from "@static/landscape-list";
import { LIST_PAGINATION_LIMIT } from "@static/observation-list";
import React from "react";

const LandscapeListPage = ({ landscapeData, initialFilterParams, nextOffset }) => {
  return (
    <LandscapeFilterProvider landscapeData={landscapeData} filter={initialFilterParams}>
      <LandscapeListComponent nextOffset={nextOffset} />
    </LandscapeFilterProvider>
  );
};

LandscapeListPage.config = {
  footer: false
};

LandscapeListPage.getInitialProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;

  const initialFilterParams = { ...LANDSCAPE_DEFAULT_FILTER, ...ctx.query };
  const { data } = await axGetDocumentListData(initialFilterParams);

  return {
    landscapeData: {
      l: data,
      hasMore: true
    },
    nextOffset,
    initialFilterParams
  };
};

export default LandscapeListPage;
