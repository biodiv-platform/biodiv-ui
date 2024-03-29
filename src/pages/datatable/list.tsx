import { DataTableFilterContextProvider } from "@components/pages/datatable/common/use-datatable-filter";
import { DEFAULT_PARAMS } from "@components/pages/datatable/common/use-datatableObservation-filter";
import DataTableListPageComponent from "@components/pages/datatable/list";
import { axGroupList } from "@services/app.service";
import { axGetDataTableList } from "@services/datatable.service";
import { axGetspeciesGroups } from "@services/observation.service";
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

export const getServerSideProps = async (ctx) => {
  const aURL = absoluteUrl(ctx).href;
  const {
    currentGroup: { id }
  } = await axGroupList(aURL);

  const initialFilterParams = { ...DEFAULT_PARAMS, ...ctx.query, userGroupId: id };
  const { data } = await axGetDataTableList(initialFilterParams);
  const { data: speciesGroups } = await axGetspeciesGroups();

  return {
    props: {
      dataTableData: {
        l: data.list || [],
        n: data.count || 0,
        hasMore: true
      },
      speciesGroups,
      initialFilterParams
    }
  };
};

export default DataTableListPage;
