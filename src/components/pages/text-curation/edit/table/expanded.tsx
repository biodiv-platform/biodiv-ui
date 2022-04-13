import { Box, SimpleGrid, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { getInjectableHTML } from "@utils/text";
import React, { useMemo } from "react";

import useCurateEdit from "../use-curate-edit";
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
  const { isShow } = useCurateEdit();

  const infoRows = useMemo(
    () => Object.entries(props.data).filter((r) => r[1] && !EXPAND_BLACKLIST.includes(r[0])),
    [props.data]
  );

  return (
    <div>
      <SimpleGrid columns={isShow ? 1 : 2} spacing={0} borderBottomWidth="1px">
        <TableContainer>
          <Table variant="striped">
            <Tbody>
              {infoRows.map(([k, v]: any) => (
                <Tr key={k}>
                  <Td>{k}</Td>
                  <Td whiteSpace="initial" wordBreak="break-word">
                    <Prose>
                      <div
                        dangerouslySetInnerHTML={{ __html: getInjectableHTML(v?.toString()) }}
                      ></div>
                    </Prose>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {!isShow && (
          <Box>
            <EditRowForm row={props.data} />
          </Box>
        )}
      </SimpleGrid>
    </div>
  );
}
