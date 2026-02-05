import React from "react";

import { authorizedPageSSP, throwUnauthorized } from "@/components/auth/auth-redirect";
import GbifExportTable from "@/components/pages/dwc";
import { DwcLogsDataProvider } from "@/components/pages/dwc/use-dwc-filter-log";
import { Role } from "@/interfaces/custom";
import { axListDwc } from "@/services/files.service";

const Dwc = ({ DwcLogData, initialFilterParams }) => (
  <DwcLogsDataProvider filter={initialFilterParams} DwcLogData={DwcLogData}>
    <GbifExportTable />
  </DwcLogsDataProvider>
);

export const getServerSideProps = async (ctx) => {
  const authResult = authorizedPageSSP([Role.Any], ctx);
  if (authResult) return authResult;

  const offset = Number(ctx.query.offset ?? 0);

  const { success, data } = await axListDwc(ctx, {
    offset,
    limit: 15
  });

  if (!success) {
    return throwUnauthorized(ctx);
  }

  return {
    props: {
      DwcLogData: {
        l: data.files || [],
        n: data.total,
        hasMore: data.total > offset + 15,
        filePath: data.filePath
      },
      nextOffset: offset + 15,
      initialFilterParams: { ...ctx.query }
    }
  };
};

export default Dwc;
