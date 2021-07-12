import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, chakra, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo } from "react";
import { useRowSelect, useSortBy, useTable } from "react-table";

interface BasicTableColumn {
  Header: string;
  accessor: string;
  isNumeric?: boolean;
  Cell?;
}

interface BasicTableProps {
  columns: BasicTableColumn[];
  data: any[];
  size?;
  tableStyle?: React.CSSProperties;
  isSelectable?;
  onSelectionChange?;
}

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <input type="checkbox" ref={resolvedRef} {...rest} style={{ width: "16px", height: "16px" }} />
  );
});

export function BasicTable({
  columns,
  data,
  tableStyle,
  size,
  isSelectable,
  onSelectionChange
}: BasicTableProps) {
  const { t } = useTranslation();

  const tableProps = useMemo(
    () =>
      isSelectable
        ? [
            useRowSelect,
            (hooks) => {
              hooks.visibleColumns.push((columns) => [
                {
                  id: "selection",
                  Header: (props) => (
                    <IndeterminateCheckbox {...props.getToggleAllRowsSelectedProps()} />
                  ),
                  Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
                  style: { width: "16px" }
                },
                ...columns
              ]);
            }
          ]
        : [],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state } = useTable(
    { columns, data },
    useSortBy,
    ...tableProps
  );

  useEffect(() => {
    if (isSelectable) {
      const selectedRows: any = [];
      Object.keys(state.selectedRowIds).map((index) => selectedRows.push(data[index]));
      onSelectionChange(selectedRows);
    }
  }, [state.selectedRowIds]);

  return data?.length ? (
    <Table variant="striped" style={tableStyle} size={size} {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Td
                fontWeight="bold"
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render("Header")}
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
                <Td
                  {...cell.getCellProps({ style: cell.column.style })}
                  isNumeric={cell.column.isNumeric}
                >
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  ) : (
    <Box p={4}>{t("common:no_results")}</Box>
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
