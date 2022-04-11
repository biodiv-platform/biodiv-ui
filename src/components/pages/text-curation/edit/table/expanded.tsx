import { Box, SimpleGrid, Table, TableContainer, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import React, { useMemo } from "react";

export default function ExpandedComponent({ data }: { data: any }) {
  const infoRows = useMemo(() => {
    return Object.entries(data).filter((r) => !!r[1]);
  }, [data]);

  return (
    <div>
      <SimpleGrid>
        <TableContainer>
          <Table variant="striped" w="full">
            <Tbody>
              {infoRows.map(([k, v]: any) => (
                <Tr key={k}>
                  <Td>{k}</Td>
                  <Td>
                    <Box whiteSpace="initial">{v}</Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </SimpleGrid>
    </div>
  );
}
