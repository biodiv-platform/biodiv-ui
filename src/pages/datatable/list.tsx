import { DataTableFilterContextProvider } from "@components/pages/datatable/common/use-datatable-filter";
import DataTableListPageComponent from "@components/pages/datatable/list";
import { axGetDataTableList } from "@services/datatable.service";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGroupList } from "@services/usergroup.service";
import { LIST_PAGINATION_LIMIT } from "@static/observation-list";
import { absoluteUrl } from "@utils/basic";
import React from "react";

function DataTableListPage({ dataTableData, initialFilterParams, speciesGroups, nextOffset }) {
  return (
    <DataTableFilterContextProvider
      filter={initialFilterParams}
      species={speciesGroups}
      dataTableData={dataTableData}
    >
      <DataTableListPageComponent nextOffset={nextOffset} />
    </DataTableFilterContextProvider>
  );
}

DataTableListPage.config = {
  footer: false
};

DataTableListPage.getInitialProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;

  const aURL = absoluteUrl(ctx).href;
  const { currentGroup } = await axGroupList(aURL);

  const initialFilterParams = { ...ctx.query, userGroupList: currentGroup.id };
  const { data } = await axGetDataTableList(initialFilterParams);
  const { data: speciesGroups } = await axGetspeciesGroups();

  return {
    dataTableData: {
      l: data.list || [],
      n: data.count || 0,
      hasMore: true
    },
    nextOffset,
    speciesGroups,
    initialFilterParams
  };
};

export default DataTableListPage;
