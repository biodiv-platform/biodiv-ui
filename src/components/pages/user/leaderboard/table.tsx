import { Box } from "@chakra-ui/core";
import { ArrowDownIcon } from "@chakra-ui/icons";
import useGlobalState from "@hooks/useGlobalState";
import useLeaderboardFilter from "@hooks/useLeaderboardFilter";
import { axGetUserLeaderboard } from "@services/esmodule.service";
import React, { useState } from "react";
import { useSortBy, useTable } from "react-table";

function UserLeaderboardTable({ columns }) {
  const { leaderboardData, setLeaderboard, filter } = useLeaderboardFilter();
  const [sortedBy, setSortedBy] = useState("NA");
  const { user } = useGlobalState();
  const authorId = user?.id || -1;

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: columns,
      data: leaderboardData,
      manualSortBy: true,
      disableMultiSort: true
    },
    useSortBy
  );

  const fetchLeaderboardData = async (v) => {
    setSortedBy(v);
    const module = v.split("_")[0].replace(/\b\w/g, (v) => v.toUpperCase());
    const payload = {
      value: module,
      how_many: filter.limit,
      time: filter.period
    };
    const data = await axGetUserLeaderboard(payload, user);
    setLeaderboard(data);
  };

  return (
    <Box maxW="full" overflowX="scroll" mb={8}>
      <table className="table table-bordered table-striped table-indexed" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th align="left" {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Box
                    onClick={() => fetchLeaderboardData(column?.id)}
                    whiteSpace="pre"
                    cursor="pointer"
                  >
                    {column.render("Header")}
                    <ArrowDownIcon opacity={sortedBy === column?.id ? 0 : 1} />
                  </Box>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                data-highlight={`${authorId}` === row?.original?.details?.author_id}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
}

export default UserLeaderboardTable;
