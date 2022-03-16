import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";

const StyledTableX = styled.table`
  min-width: 100%;
  border: none;
  border-collapse: collapse;
  background: white;
  td,
  th {
    border: none;
    padding: 0.5rem;
  }
  tr {
    border-top: 1px solid #e2e8f0;
  }
  thead {
    background: var(--chakra-colors-gray-100);
    font-weight: bold;
    tr {
      border: 0;
    }
  }
`;

export default function StyledTable({ columns, data }) {
  return (
    <Box border="2px solid" borderColor="gray.200" borderRadius="md" overflowY="auto">
      <StyledTableX>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <td key={index}>{col.name}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map(({ selector }, index) => (
                <td key={index}>{item?.[selector]?.toString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTableX>
    </Box>
  );
}
