import { Box } from "@chakra-ui/core";
import React from "react";
import { filterXSS } from "xss";

export default function HomeDescription({ description }) {
  return (
    <Box
      mb={10}
      className="description-box"
      dangerouslySetInnerHTML={{
        __html: filterXSS(description)
      }}
    ></Box>
  );
}
