import { Box, Link } from "@chakra-ui/core";
import React from "react";

export default function () {
  return (
    <Box mb={4}>
      To Add/Change <strong>Custom Fields or Group Rules</strong> please contact{"  "}
      <Link color="blue.500" href="mailto:support@indiabiodiversity.org" isExternal>
        @Administrator
      </Link>
    </Box>
  );
}
