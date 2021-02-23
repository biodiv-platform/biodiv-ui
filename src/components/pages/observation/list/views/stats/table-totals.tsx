import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";

const CardLink = styled.a`
  div {
    border: 2px solid var(--gray-200);
    .count {
      font-size: 1.6rem;
    }
  }
`;

export default function TableTotals({ totals }) {
  return (
    <SimpleGrid columns={{ md: 4 }} spacing={4} mb={4}>
      {Object.keys(totals).map((metric) => (
        <CardLink>
          <Box p={4} className="white-box" bg="gray" borderRadius="lg">
            <Text className="count" fontSize="3xl" mt={2}>
              {totals[metric] != undefined ? totals[metric] : 0}
            </Text>
            <Text>{metric}</Text>
          </Box>
        </CardLink>
      ))}
    </SimpleGrid>
  );
}
