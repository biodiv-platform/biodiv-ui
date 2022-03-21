import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { BasicTable } from "@components/@core/table";
import { axShowDataset, axUpdateDataset } from "@services/extraction.service";
import React, { useEffect, useMemo, useState } from "react";
import DataGrid, {
  Column,
  SelectCellFormatter,
  SelectColumn,
  SortColumn,
  TextEditor
} from "react-data-grid";
import InfiniteScroll from "react-infinite-scroll-component";

import Loading from "../common/loading";

/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

interface Row {
  uniqueId: number;
  locations: string;
  day: number;
  month: number;
}

function rowKeyGetter(row: Row) {
  return row.uniqueId;
}

function helloWorld() {
  console.log("hello world");
}

const updateRow = async (allRows, updatedRowsInfo, setter) => {
  const changedRow = allRows[updatedRowsInfo["indexes"][0]];
  await axUpdateDataset(changedRow);
  console.log(changedRow);
  setter(allRows);
};

type Comparator = (a: Row, b: Row) => number;
function getComparator(sortColumn: string): Comparator {
  switch (sortColumn) {
    case "locations":
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };

    case "uniqueId":
    case "day":
    case "month":
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };

    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}

const DatasetShowPage = ({ data, columns }) => {
  const [rows, setRows] = useState(data);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  const sortedRows = useMemo((): readonly Row[] => {
    if (sortColumns.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === "ASC" ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [rows, sortColumns]);

  const c = columns.map((v) => ({
    key: v,
    name: v,
    editor: TextEditor
  }));

  return (
    <Box className="white-box" id="scrollableDiv" maxH={500} overflow="auto" mb={4}>
      <DataGrid
        columns={c}
        rows={sortedRows}
        defaultColumnOptions={{
          sortable: true,
          resizable: true
        }}
        rowKeyGetter={rowKeyGetter}
        onRowClick={(i) => {
          console.log(i);
        }}
        onRowsChange={(allRows, updatedRowsInfo) => {
          updateRow(allRows, updatedRowsInfo, setRows);
          console.log(updatedRowsInfo);
        }}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
      />
      <Button
        colorScheme="blue"
        size="lg"
        onClick={() => {
          console.log(rows);
        }}
      >
        Button
      </Button>
    </Box>
  );
};

export default DatasetShowPage;
