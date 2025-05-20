import { WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Heading, Icon, Text } from "@chakra-ui/react";
import ObservationLoading from "@components/pages/common/loading";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React, { Suspense } from "react";

import ListView from "./list";

const GridView = React.lazy(() => import("./grid"));

export default function Views({ no }) {
  const { filter } = useObservationFilter();

  switch (filter?.view) {
    case "list":
      return <ListView no={no} />;

    case "list_minimal":
      return (
        <Suspense fallback={<ObservationLoading />}>
          <GridView />
        </Suspense>
      );

    case "stats":
      return (
        <Suspense fallback={<ObservationLoading />}>
          <Box display="flex" alignItems="center" justifyContent="center" px={6}>
            <Box textAlign="center" maxW="md">
              <Icon as={WarningTwoIcon} boxSize={16} mb={6} color="yellow.400" />
              <Heading size="lg" mb={4}>
                Page Temporarily Unavailable
              </Heading>
              <Text color="gray.500" mb={6}>
                This page is currently down for maintenance. Please check back later.
              </Text>
            </Box>
          </Box>
        </Suspense>
      );

    default:
      return null;
  }
}
