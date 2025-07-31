import { Box, chakra, Table } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo } from "react";
import { LuMoveDown, LuMoveUp } from "react-icons/lu";
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
  translateHeader?: boolean;
  tableStyle?: React.CSSProperties;
  getCheckboxProps?: any;
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
  translateHeader,
  isSelectable,
  onSelectionChange,
  getCheckboxProps
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
    { columns, data, getCheckboxProps },
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
    <Table.Root striped style={tableStyle} size={size} {...getTableProps()}>
      <Table.Header>
        {headerGroups.map((headerGroup) => (
          <Table.Row {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Table.ColumnHeader
                fontWeight="bold"
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {translateHeader ? t(column.Header) : column.render("Header")}
                <chakra.span pl="2">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <LuMoveDown aria-label="sorted descending" />
                    ) : (
                      <LuMoveUp aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Table.Row {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Table.Cell
                  {...cell.getCellProps({
                    style: { whiteSpace: "nowrap", wordBreak: "keep-all", ...cell.column.style }
                  })}
                  isNumeric={cell.column.isNumeric}
                >
                  {cell.render("Cell")}
                </Table.Cell>
              ))}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
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
