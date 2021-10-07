import { DataTableFilterContextProvider } from "@components/pages/datatable/common/use-datatable-filter";
import DataTableListPageComponent from "@components/pages/datatable/list";
import { axGetDataTableList } from "@services/datatable.service";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGroupList } from "@services/usergroup.service";
import { absoluteUrl } from "@utils/basic";
import React from "react";

function DataTableListPage({ dataTableData, initialFilterParams, speciesGroups }) {
  return (
    <DataTableFilterContextProvider
      filter={initialFilterParams}
      species={speciesGroups}
      dataTableData={dataTableData}
    >
      <DataTableListPageComponent />
    </DataTableFilterContextProvider>
  );
}

DataTableListPage.config = {
  footer: false
};

DataTableListPage.getInitialProps = async (ctx) => {
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
    speciesGroups,
    initialFilterParams
  };
};

export default DataTableListPage;
