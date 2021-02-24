import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function TableTotals({ totals }) {
  const { t } = useTranslation();
  return (
    <SimpleGrid columns={{ md: 4 }} spacing={4} mb={4}>
      {Object.keys(totals).map((metric) => (
        <Box p={4} className="white-box" bg="gray" borderRadius="lg">
          <Text fontSize="3xl" mt={2}>
            {totals[metric] != undefined ? totals[metric] : 0}
          </Text>
          <Text>{t(`LIST.STATS_BAR.${metric}`)}</Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
