import { Box } from "@chakra-ui/react";
import React from "react";

import Header from "./header";
import Views from "./table";

export default function DownloadLogListComponent() {
  return (
    <Box className="container mt" pb={6}>
      <Header />
      <Views />
    </Box>
  );
}
