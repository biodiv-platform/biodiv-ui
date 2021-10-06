import Loading from "@components/pages/common/loading";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useDataTableList from "../../common/use-datatable-filter";
import InfoView from "./info";

export default function Views() {
  const { dataTableData, nextPage } = useDataTableList();

  return Array.isArray(dataTableData?.l) ? (
    <InfiniteScroll
      dataLength={dataTableData?.l.length || 0}
      next={nextPage}
      hasMore={dataTableData?.hasMore}
      loader={<Loading key={0} />}
      scrollableTarget="items-container"
    >
      {dataTableData?.l.map((dt) => (
        <InfoView key={dt.id} datatable={dt} />
      ))}
    </InfiniteScroll>
  ) : (
    <Loading />
  );
}
