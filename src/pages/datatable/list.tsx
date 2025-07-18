import { DataTableFilterContextProvider } from "@components/pages/datatable/common/use-datatable-filter";
import { DEFAULT_PARAMS } from "@components/pages/datatable/common/use-datatableObservation-filter";
import DataTableListPageComponent from "@components/pages/datatable/list";
import SITE_CONFIG from "@configs/site-config";
import { axGroupList } from "@services/app.service";
import { axGetDataTableList } from "@services/datatable.service";
import { axGetspeciesGroups } from "@services/observation.service";
import { absoluteUrl } from "@utils/basic";
import { getLanguageId } from "@utils/i18n";
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
    currentGroup: { groupId }
  } = await axGroupList(aURL, getLanguageId(ctx.locale)?.ID ?? SITE_CONFIG.LANG.DEFAULT_ID);

  const initialFilterParams = { ...DEFAULT_PARAMS, ...ctx.query, userGroupId: groupId };
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
