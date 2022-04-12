import { Box } from "@chakra-ui/react";
import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

import useCurateEdit from "../use-curate-edit";
import { columns, editColumn } from "./data";
import ExpandedComponent from "./expanded";

export default function TextCurationTable() {
  const { rows, isShow } = useCurateEdit();

  const finalColumns = useMemo(() => (isShow ? columns : [...columns, editColumn]), [isShow]);

  return (
    <Box bg="white" borderRadius="md" borderWidth={1} mb={8}>
      <DataTable
        columns={finalColumns}
        data={rows.filtered}
        expandableRows={true}
        pagination={true}
        conditionalRowStyles={[
          {
            when: (row) => row.curatedStatus !== "PENDING",
            style: (row) => ({
              backgroundColor:
                row.curatedStatus === "CURATED"
                  ? "var(--chakra-colors-green-100)"
                  : "var(--chakra-colors-red-100)"
            })
          }
        ]}
        expandableRowsComponent={ExpandedComponent}
      />
    </Box>
  );
}
