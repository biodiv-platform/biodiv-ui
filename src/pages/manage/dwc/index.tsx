import React from "react";

import { authorizedPageSSR, throwUnauthorized } from "@/components/auth/auth-redirect";
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
  authorizedPageSSR([Role.Admin], ctx, false);

  const offset = parseInt(ctx.query.offset || "0", 10);

  const { success, data } = await axListDwc({ offset, limit: 15 }, ctx);

  if (success) {
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
  } else {
    throwUnauthorized(ctx);
  }
};

export default Dwc;
