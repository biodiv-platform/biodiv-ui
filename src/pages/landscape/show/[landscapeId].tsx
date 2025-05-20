import { WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Heading, Icon, Text } from "@chakra-ui/react";
import React from "react";

export const documentsListParams = {
  geoShapeFilterField: "documentCoverages.topology",
  nestedField: "documentCoverages",
  max: 6
};

const ObservationShowPage = () => (
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
);

export const getServerSideProps = async () => {
  return {
    props: {}
  };
};

export default ObservationShowPage;
