import React from "react";

import { authorizedPageSSP } from "@/components/auth/auth-redirect";
import GbifExportTable from "@/components/pages/dwc";
import { DwcLogsDataProvider } from "@/components/pages/dwc/use-dwc-filter-log";
import { Role } from "@/interfaces/custom";

const Dwc = ({ initialFilterParams }) => (
  <DwcLogsDataProvider filter={initialFilterParams}>
    <GbifExportTable />
  </DwcLogsDataProvider>
);

export const getServerSideProps = async (ctx) => {
  const authResult = authorizedPageSSP([Role.Admin], ctx);
  if (authResult) return authResult;

  return {
    props: {
      initialFilterParams: { ...ctx.query }
    }
  };
};

export default Dwc;