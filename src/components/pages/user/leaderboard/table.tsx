import { Box, Icon } from "@chakra-ui/core";
import { axGetUserLeaderboard } from "@services/esmodule.service";
import { useStoreState } from "easy-peasy";
import NProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { useSortBy, useTable } from "react-table";

function UserLeaderboardTable({ module, limit, time, columns }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [sortedBy, setSortedBy] = useState("NA");
  const authorId = useStoreState((s) => s.user.id);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: columns,
      data: leaderboardData,
      manualSortBy: true,
      disableMultiSort: true
    },
    useSortBy
  );

  const fetchLeaderboardData = async (count, period, column = "") => {
    NProgress.start();
    setSortedBy(column);
    const payload = column.split("_")[0].replace(/\b\w/g, (v) => v.toUpperCase());
    const data = await axGetUserLeaderboard(payload, count, period, authorId);
    setLeaderboardData(data);
    NProgress.done();
  };

  useEffect(() => {
    fetchLeaderboardData(limit, time, module);
  }, [limit, module, time, columns]);

  return (
    <Box maxW="full" overflowX="scroll" mb={8}>
      <table className="table table-bordered table-striped table-indexed" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th align="left" {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Box
                    onClick={() => fetchLeaderboardData(limit, time, column?.id)}
                    whiteSpace="pre"
                    cursor="pointer"
                  >
                    {column.render("Header")}
                    <Icon name="arrow-down" hidden={sortedBy !== column?.id} />
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
