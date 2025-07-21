import { Box } from "@chakra-ui/react";
import useGlobalState from "@hooks/use-global-state";
import { axGetUserLeaderboard } from "@services/esmodule.service";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { LuMoveDown } from "react-icons/lu";
import { useSortBy, useTable } from "react-table";

import useLeaderboardFilter from "./use-leaderboard-filter";

function UserLeaderboardTable({ columns }) {
  const { t } = useTranslation();
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
    const module = v.split("_")[0].replace(/\b\w/g, (s) => s.toUpperCase());
    const payload = {
      value: module,
      how_many: filter?.limit,
      time: filter?.period
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
                    {t(column.render("Header"))}
                    <LuMoveDown opacity={sortedBy === column?.id ? 0 : 1} />
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
