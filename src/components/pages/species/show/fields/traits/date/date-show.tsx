import { Flex, SimpleGrid } from "@chakra-ui/react";
import { formatDate } from "@utils/date";
import React from "react";

export function TraitDateShow({ values, format }) {
  return (
    <SimpleGrid columns={{ md: 3 }} gap={4}>
      {values.map(({ fromDate, toDate }) => (
        <Flex
          key={fromDate + toDate}
          border="2px"
          borderColor="gray.300"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          lineHeight={1}
          h="3.25rem"
        >
          <div>
            {toDate
              ? formatDate(fromDate, format) + " - " + formatDate(toDate, format)
              : formatDate(fromDate, format)}
          </div>
        </Flex>
      ))}
    </SimpleGrid>
  );
}
