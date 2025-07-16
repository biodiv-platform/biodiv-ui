import { Box, Skeleton, Text } from "@chakra-ui/react";
import React from "react";

export default function TableTotals({ title, count, isLoading }) {
  return (
    <Skeleton loading={isLoading} borderRadius="md">
      <Box p={4} className="white-box" borderRadius="lg" lineHeight={1}>
        <Text fontSize="3xl" mb={2}>
          {count || 0}
        </Text>
        <Text>{title}</Text>
      </Box>
    </Skeleton>
  );
}
