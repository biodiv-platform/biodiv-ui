import { DownloadLogsDataProvider } from "@components/pages/user/common/use-download-log";
import DownloadLogListComponent from "@components/pages/user/list/download-logs";
import { axGetDownloadLogsList } from "@services/user.service";
import { LIST_PAGINATION_LIMIT } from "@static/observation-list";
import React from "react";

const DownloadLogsList = ({ downloadLogData, initialFilterParams }) => (
  <DownloadLogsDataProvider filter={initialFilterParams} downloadLogData={downloadLogData}>
    <DownloadLogListComponent />
  </DownloadLogsDataProvider>
);

DownloadLogsList.config = {
  footer: false
};

export const getServerSideProps = async (ctx) => {
  const { data } = await axGetDownloadLogsList({ ...ctx.query, offset: 0 });

  return {
    props: {
      downloadLogData: {
        l: data.downloadLogList || [],
        n: data.count || 0,
        hasMore: true
      },
      nextOffset: LIST_PAGINATION_LIMIT,
      initialFilterParams: { ...ctx.query }
    }
  };
};

export default DownloadLogsList;
