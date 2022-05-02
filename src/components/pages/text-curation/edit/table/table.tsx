import { Box } from "@chakra-ui/react";
import React from "react";
import DataTable from "react-data-table-component";

import useCurateEdit from "../use-curate-edit";
import { columns } from "./data";
import ExpandedComponent from "./expanded";

export default function TextCurationTable() {
  const { rows, isShow, canEdit } = useCurateEdit();

  if (!isShow && !canEdit) return null;

  return (
    <Box bg="white" borderRadius="md" borderWidth={1} mb={8}>
      <DataTable
        columns={columns}
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
