import { Box, SimpleGrid, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import React, { useMemo } from "react";

import EditRowForm from "./form";

export default function ExpandedComponent(props) {
  const infoRows = useMemo(() => {
    return Object.entries(props.data).filter((r) => !!r[1]);
  }, [props.data]);

  return (
    <div>
      <SimpleGrid columns={2} spacing={0}>
        <TableContainer>
          <Table variant="striped">
            <Tbody>
              {infoRows.map(([k, v]: any) => (
                <Tr key={k}>
                  <Td>{k}</Td>
                  <Td whiteSpace="initial" wordBreak="break-word">
                    {v}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Box>
          <EditRowForm row={props.data} />
        </Box>
      </SimpleGrid>
    </div>
  );
}
