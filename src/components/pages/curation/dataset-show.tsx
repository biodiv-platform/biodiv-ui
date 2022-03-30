import { Box } from "@chakra-ui/react";
import { axUpdateDataset } from "@services/extraction.service";
import React, { useMemo, useState } from "react";
import DataGrid, { SortColumn, TextEditor } from "react-data-grid";

/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */
const EditableColumns = ["curatedSNames", "curatedLocations", "curatedDates", "isValid"];
interface Row {
  uniqueId: number;
  locations: string;
  day: number;
  month: number;
  scientificNamesGNRD: string;
  scientificNamesFlashtext: string;
  year: string;
  curatedSNames: string;
  curatedLocations: string;
  curatedDates: string;
  isValid: string;
}

function rowKeyGetter(row: Row) {
  return row.uniqueId;
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
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
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

  const c = columns.map((v) =>
    EditableColumns.includes(v)
      ? {
          key: v,
          name: v,
          editor: TextEditor
        }
      : {
          key: v,
          name: v
        }
  );

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
    </Box>
  );
};

export default DatasetShowPage;
