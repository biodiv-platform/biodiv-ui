import { Box } from "@chakra-ui/react";
import React from "react";

import Header from "./header";
import Views from "./views";

export default function DataTableListPageComponent() {
  return (
    <Box className="container mt">
      <Header />
      <Views />
    </Box>
  );
}
