import { Box } from "@chakra-ui/react";
import React from "react";

import Header from "./header";
import Views from "./table";

export default function DownloadLogListComponent() {
  return (
    <Box w="full" maxH="calc( 100vh - var(--heading-height) )" display="flex">
      <Box
        maxH="full"
        w="full"
        id="items-container"
        overflowY="auto"
        gridColumn={{ lg: "4/15" }}
        px={4}
      >
        <Header />
        <Views />
      </Box>
    </Box>
  );
}
