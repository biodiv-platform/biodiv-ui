import { BasicTable } from "@components/@core/table";
import Loading from "@components/pages/common/loading";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useSpeciesList from "../../use-species-list";
import { speciesTableMetaData } from "./table-metadata";

export default function TableView() {
  const {
    speciesData,
    species: speciesGroups,
    getCheckboxProps,
    hasUgAccess,
    selectAll,
    nextPage
  } = useSpeciesList();
  const [canEdit, setCanEdit] = useState(false);
  const [fieldData, setFieldData] = useState<any[]>(speciesData?.l);
  const [tableMeta, setTableMeta] = useState(
    speciesTableMetaData(speciesData?.l, speciesGroups, canEdit)
  );

  useEffect(() => {
    setCanEdit(hasAccess([Role.Admin]) || hasUgAccess || false);
  }, [hasUgAccess]);

  useEffect(() => {
    setFieldData(speciesData?.l);
    setTableMeta(speciesTableMetaData(speciesData?.l, speciesGroups, canEdit));
  }, [selectAll, speciesData.l.length]);

  return (
    <InfiniteScroll
      dataLength={speciesData.l.length}
      next={nextPage}
      hasMore={speciesData.hasMore}
      loader={<Loading />}
      scrollableTarget="items-container"
    >
      {fieldData && (
        <BasicTable
          getCheckboxProps={getCheckboxProps}
          translateHeader
          data={fieldData || []}
          columns={tableMeta}
        />
      )}
    </InfiniteScroll>
  );
}
