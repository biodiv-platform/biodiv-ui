import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

import NotFoundIllustration from "./illustration";

export default function PageNotFoundComponent() {
  return (
    <Flex direction="column" alignItems="center" pt="3rem" className="container">
      <NotFoundIllustration />
      <Heading mt={10} mb={4}>
        404: Not Found
      </Heading>
      <Text>We looked everywhere, but this page just wasn&apos;t there.</Text>
    </Flex>
  );
}
