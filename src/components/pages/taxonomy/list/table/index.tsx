import { Box, Text } from "@chakra-ui/react";
import { BasicTable } from "@components/@core/table";
import { format } from "indian-number-format";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "@/components/pages/common/loading";
import { Role } from "@/interfaces/custom";
import { hasAccess } from "@/utils/auth";

import useTaxonFilter from "../use-taxon";
import { taxonTableMetaData } from "./table-metadata";

export default function TaxonListTable() {
  const { taxonListData, onSelectionChange, nextPage } = useTaxonFilter();
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
        <>
        {taxonListData.count!=-1 && <Box>
          <Text color="gray.600">
            {format(taxonListData.count)} {"Taxonomy Found"}
          </Text>
      </Box>}
        <BasicTable
          data={fieldData || []}
          columns={tableMeta}
          translateHeader
          size="sm"
          {...(canEdit && {
            isSelectable: true,
            onSelectionChange
          })}
        />
        </>
      )}
    </InfiniteScroll>
  );
}