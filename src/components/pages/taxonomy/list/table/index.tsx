import { BasicTable } from "@components/@core/table";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "@/components/pages/common/loading";
import { Role } from "@/interfaces/custom";
import { hasAccess } from "@/utils/auth";

import useTaxonFilter from "../use-taxon";
import { taxonTableMetaData } from "./table-metadata";

export default function TaxonListTable() {
  const { taxonListData, setSelectedTaxons, nextPage } = useTaxonFilter();
  const [fieldData, setFieldData] = useState<any[]>(taxonListData?.l);

  const [tableMeta, setTableMeta] = useState(taxonTableMetaData(taxonListData?.l));

  const canEdit = hasAccess([Role.Admin]);

  useEffect(() => {
    setFieldData(taxonListData?.l);
    setTableMeta(taxonTableMetaData(taxonListData?.l));
  }, [taxonListData.l.length]);

  return (
    <InfiniteScroll
      dataLength={taxonListData.l.length}
      next={nextPage}
      hasMore={taxonListData.hasMore}
      loader={<Loading />}
      scrollableTarget="items-container"
    >
      {fieldData && (
        <BasicTable
          getCheckboxProps={(row) => (row === "header" ? { disabled: true } : {})}
          data={fieldData || []}
          columns={tableMeta}
          translateHeader
          size="sm"
          {...(canEdit && {
            isSelectable: true,
            onSelectionChange: setSelectedTaxons
          })}
        />
      )}
    </InfiniteScroll>
  );
}
