import { DocumentFilterProvider } from "@components/pages/document/common/use-document-filter";
import DocumentListPageComponent from "@components/pages/document/list";
import { axGroupList } from "@services/app.service";
import { axGetListData } from "@services/document.service";
import { DEFAULT_FILTER, LIST_PAGINATION_LIMIT } from "@static/documnet-list";
import { absoluteUrl } from "@utils/basic";
import React from "react";

function DocumentListPage({ documentData, initialFilterParams, nextOffset }) {
  return (
    <DocumentFilterProvider filter={initialFilterParams} documentData={documentData}>
      <DocumentListPageComponent nextOffset={nextOffset} />
    </DocumentFilterProvider>
  );
}

DocumentListPage.config = {
  footer: false
};

export const getServerSideProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;

  const aURL = absoluteUrl(ctx).href;
  const { currentGroup } = await axGroupList(aURL);

  const initialFilterParams = { ...DEFAULT_FILTER, ...ctx.query, userGroupList: currentGroup?.id };
  const { data } = await axGetListData(initialFilterParams);

  return {
    props: {
      documentData: {
        l: data.documentList,
        n: data.totalCount,
        ag: data.aggregationData,
        mvp: {},
        hasMore: true
      },
      nextOffset,
      initialFilterParams
    }
  };
};

export default DocumentListPage;
