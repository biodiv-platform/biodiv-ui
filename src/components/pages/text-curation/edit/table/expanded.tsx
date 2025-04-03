import { Box, Container, SimpleGrid, Table } from "@chakra-ui/react";
import { getInjectableHTML } from "@utils/text";
import React, { useMemo } from "react";

import { Prose } from "@/components/ui/prose";

import useCurateEdit from "../use-curate-edit";
import EditRowForm from "./form";

const EXPAND_BLACKLIST = [
  "validatedStatus",
  "locationAccuracy",
  "latitude",
  "longitude",
  "rank",
  "taxonId",
  "taxonomyMatchedNames",
  "hierarchy",
  "DATE",
  "locations",
  "scientificNames",
  "scientificNamesFlashtext",
  "scientificNamesGNRD",
  "curatedDate",
  "curatedDateFormat",
  "curatedLocation",
  "curatedSName",
  "curatedStatus",
  "peliasLocations"
];

export default function ExpandedComponent(props) {
  const { isShow } = useCurateEdit();

  const infoRows = useMemo(
    () => Object.entries(props.data).filter((r) => r[1] && !EXPAND_BLACKLIST.includes(r[0])),
    [props.data]
  );

  return (
    <div>
      <SimpleGrid columns={isShow ? 1 : 2} gap={0} borderBottomWidth="1px">
        <Container>
          <Table.Root striped>
            <Table.Body>
              {infoRows.map(([k, v]: any) => (
                <Table.Row key={k}>
                  <Table.Cell>{k}</Table.Cell>
                  <Table.Cell whiteSpace="initial" wordBreak="break-word">
                    <Prose>
                      <div
                        dangerouslySetInnerHTML={{ __html: getInjectableHTML(v?.toString()) }}
                      ></div>
                    </Prose>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Container>
        {!isShow && (
          <Box>
            <EditRowForm row={props.data} />
          </Box>
        )}
      </SimpleGrid>
    </div>
  );
}
