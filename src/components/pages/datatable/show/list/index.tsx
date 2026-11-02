import { Box } from "@chakra-ui/react";
import { BasicTable } from "@components/@core/table";
import Loading from "@components/pages/common/loading";
import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useDataTableObservation from "../../common/use-datatableObservation-filter";
import { dataTableObservationRow, parseObservationData } from "./table-metadata";

export default function ObservationsList({ dataTable: dt, speciesGroups }) {
  const { observationData, nextPage } = useDataTableObservation();
  const list = observationData?.l;

  const groupOptions = useMemo(
    () =>
      speciesGroups
        ?.filter((g) => g.name !== undefined && g.id !== undefined)
        .map((g) => ({ label: g.name as string, value: g.id as number })),
    [speciesGroups]
  );

  const fieldData = useMemo(() => parseObservationData(list), [list]);

  const tableMeta = useMemo(
    () => dataTableObservationRow(list, groupOptions, dt),
    [list, groupOptions, dt]
  );

  return (
    <Box className="white-box" id="scrollableDiv" maxH={350} overflow="auto" mb={4}>
      <InfiniteScroll
        dataLength={observationData?.l?.length || 0}
        next={nextPage}
        style={{ overflow: "unset" }}
        hasMore={observationData?.hasMore || false}
        loader={<Loading />}
        scrollableTarget="scrollableDiv"
      >
        <BasicTable translateHeader data={fieldData} columns={tableMeta} />
      </InfiniteScroll>
    </Box>
  );
}
