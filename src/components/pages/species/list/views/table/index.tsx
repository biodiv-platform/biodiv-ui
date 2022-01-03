import { BasicTable } from "@components/@core/table";
import Loading from "@components/pages/common/loading";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useSpeciesList from "../../use-species-list";
import { speciesTableMetaData } from "./table-metadata";

export default function TableView() {
  const { speciesData, species: speciesGroups, nextPage } = useSpeciesList();

  const [fieldData, setFieldData] = useState<any[]>(speciesData?.l);
  const [tableMeta, setTableMeta] = useState(speciesTableMetaData(speciesData?.l, speciesGroups));

  useEffect(() => {
    setFieldData(speciesData?.l);
    setTableMeta(speciesTableMetaData(speciesData?.l, speciesGroups));
  }, [speciesData.l.length]);

  return (
    <InfiniteScroll
      dataLength={speciesData.l.length}
      next={nextPage}
      hasMore={speciesData.hasMore}
      loader={<Loading />}
      scrollableTarget="items-container"
    >
      <BasicTable translateHeader data={fieldData || []} columns={tableMeta} />
    </InfiniteScroll>
  );
}
