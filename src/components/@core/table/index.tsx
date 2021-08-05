import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, chakra, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useSortBy, useTable } from "react-table";

interface BasicTableColumn {
  Header: string;
  accessor: string;
  isNumeric?: boolean;
  Cell?;
}

interface BasicTableProps {
  columns: BasicTableColumn[];
  data: any[];
  translateHeader?: boolean;
  tableStyle?: React.CSSProperties;
}

export function BasicTable({ columns, data, tableStyle, translateHeader }: BasicTableProps) {
  const { t } = useTranslation();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useSortBy
  );

  return data?.length ? (
    <Table variant="striped" style={tableStyle} {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Td
                fontWeight="bold"
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {translateHeader? t(column.Header) : column.render("Header")}
                <chakra.span pl="4">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ) : (
                      <TriangleUpIcon aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Td>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  ) : (
    <Box p={4}>{t("no_results")}</Box>
  );
}

export const ResponsiveContainer = ({ children, noBorder, ...props }: any) => (
  <Box
    bg="white"
    border={noBorder ? 0 : "1px solid"}
    borderColor="gray.300"
    borderRadius="md"
    overflowX="auto"
    {...props}
  >
    {children}
  </Box>
);
