import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import styled from "@emotion/styled";
import React from "react";

export default function Table(props) {
  const Table = styled.table`
    tr {
      border-bottom: 1px solid var(--gray-300);
    }
    td:first-of-type {
      border-left: 0;
    }
  `;
  return (
    <Box className="white-box">
      <BoxHeading p={4} fontSize="md">
        {props.title}
      </BoxHeading>
      <Box w="full" overflowY="auto" h={370}>
        <Table className="table">
          <tbody>
            {props.names.map((d, i) => (
              <tr>
                <td>{d}</td>
                <td>{props.counts[i]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Box>
  );
}
