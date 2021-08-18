import { Box } from "@chakra-ui/react";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import Loading from "@components/pages/common/loading";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useDownloadLogsList from "../../common/use-download-log";
import { downloadLogsRow } from "./metadata";

export default function DownloadLogsTable() {
  const { t } = useTranslation();
  const { downloadLogData, nextPage } = useDownloadLogsList();

  const [fieldData, setFieldData] = useState<any[]>(downloadLogData?.l);
  const [tableMeta, setTableMeta] = useState(
    downloadLogsRow(downloadLogData.l, `${t("user:download")}`, `${t("user:file_not_found")}`)
  );

  useEffect(() => {
    setFieldData(downloadLogData?.l);
    setTableMeta(
      downloadLogsRow(
        downloadLogData?.l,
        `${t("user:download")}`,
        `${t("user:file_not_found")}`
      )
    );
  }, [downloadLogData.l.length]);

  return (
    <Box mt={4} id="scrollableDiv" overflow="auto" h={500}>
      <InfiniteScroll
        dataLength={downloadLogData.l.length}
        next={nextPage}
        hasMore={true}
        loader={<Loading />}
        scrollableTarget="scrollableDiv"
      >
        <ResponsiveContainer>
          <BasicTable translateHeader data={fieldData || []} columns={tableMeta} />
        </ResponsiveContainer>
      </InfiniteScroll>
    </Box>
  );
}
