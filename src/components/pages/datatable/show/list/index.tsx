import { Box } from "@chakra-ui/react";
import { BasicTable } from "@components/@core/table";
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
    <Box className="white-box" id="scrollableDiv" maxH={350} overflow="auto" mb={4}>
      <InfiniteScroll
        dataLength={observationData.l.length}
        next={nextPage}
        style={{ overflow: "unset" }}
        hasMore={observationData.hasMore}
        loader={<Loading />}
        scrollableTarget="scrollableDiv"
      >
        <BasicTable translateHeader data={fieldData || []} columns={tableMeta} />
      </InfiniteScroll>
    </Box>
  );
}
