import { Box, Flex } from "@chakra-ui/react";
import React from "react";

const ImageGridContainer = ({ children }) => (
  <Flex alignItems="center" justifyContent="center">
    <Box
      display="flex"
      overflowX="auto"
      overscrollBehaviorX="contain"
      pb={2}
      mt={4}
      style={{ scrollSnapType: "x mandatory" }}
      width="100%"
    >
      {children}
    </Box>
  </Flex>
);

export default ImageGridContainer;
