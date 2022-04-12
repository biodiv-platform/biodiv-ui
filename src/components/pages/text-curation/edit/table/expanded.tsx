import { Box, SimpleGrid, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import React, { useMemo } from "react";

import EditRowForm from "./form";

const EXPAND_BLACKLIST = [
  "DATE",
  "locations",
  "scientificNames",
  "scientificNamesFlashtext",
  "scientificNamesGNRD",
  "curatedDate",
  "curatedDateFormat",
  "curatedLocation",
  "curatedSName",
  "curatedStatus"
];

export default function ExpandedComponent(props) {
  const infoRows = useMemo(() => {
    return Object.entries(props.data).filter((r) => r[1] && !EXPAND_BLACKLIST.includes(r[0]));
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
