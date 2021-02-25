import { Box, Text } from "@chakra-ui/react";
import React from "react";

export default function TableTotals({ title, count }) {
  return (
    <Box p={4} className="white-box" bg="gray" borderRadius="lg">
      {count && (
        <Text fontSize="3xl" mt={2}>
          {count}
        </Text>
      )}
      <Text>{title}</Text>
    </Box>
  );
}
