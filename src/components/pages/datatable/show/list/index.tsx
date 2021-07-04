import { Box } from "@chakra-ui/react";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import Loading from "@components/pages/common/loading";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useDataTableObservation from "../../common/use-datatableObservation-filter";
import { dataTableObservationRow, parseObservationData } from "./table-metadata";

export default function ObservationsList({ dataTable: dt, speciesGroups }) {
  const { observationData, nextPage } = useDataTableObservation();

  const [fieldData, setFieldData] = useState<any[]>(parseObservationData(observationData?.l));
  const [tableMeta, setTableMeta] = useState(
    dataTableObservationRow(observationData.l, speciesGroups, dt)
  );

  useEffect(() => {
    setFieldData(parseObservationData(observationData?.l));
    setTableMeta(dataTableObservationRow(observationData?.l, speciesGroups, dt));
  }, [observationData.l.length]);

  return (
    <Box id="scrollableDiv" overflow="auto" h={500}>
      <InfiniteScroll
        dataLength={observationData.l.length}
        next={nextPage}
        hasMore={true}
        loader={<Loading />}
        scrollableTarget="scrollableDiv"
      >
        <ResponsiveContainer>
          <BasicTable data={fieldData || []} columns={tableMeta} />
        </ResponsiveContainer>
      </InfiniteScroll>
    </Box>
  );
}
