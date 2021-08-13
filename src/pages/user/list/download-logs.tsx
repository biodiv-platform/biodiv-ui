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
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;
  const { data } = await axGetDownloadLogsList({ ...ctx.query });

  return {
    props: {
      downloadLogData: {
        l: data.downloadLogList || [],
        n: data.count || 0,
        hasMore: true
      },
      nextOffset,
      initialFilterParams: { ...ctx.query }
    }
  };
};

export default DownloadLogsList;
