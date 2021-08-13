import { DownloadLogsDataProvider } from "@components/pages/user/common/use-download-log";
import UserShowPageComponent from "@components/pages/user/show";
import { axGetDownloadLogsList, axGetUserById } from "@services/user.service";
import { LIST_PAGINATION_LIMIT } from "@static/observation-list";
import React from "react";

import Error from "../../_error";

const UserShowPage = ({ user, success, downloadLogData, initialFilterParams }) =>
  success ? (
    <DownloadLogsDataProvider filter={initialFilterParams} downloadLogData={downloadLogData}>
      <UserShowPageComponent user={user} />
    </DownloadLogsDataProvider>
  ) : (
    <Error statusCode={404} />
  );

export const getServerSideProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;
  const { success, data: user } = await axGetUserById(ctx.query.userId, ctx);
  const { data } = await axGetDownloadLogsList({ ...ctx.query });

  return {
    props: {
      downloadLogData: {
        l: data.downloadLogList || [],
        n: data.count || 0,
        hasMore: true
      },
      nextOffset,
      initialFilterParams: { ...ctx.query },
      user,
      success
    }
  };
};

export default UserShowPage;
