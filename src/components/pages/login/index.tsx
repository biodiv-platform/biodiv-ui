import { Box, Flex } from "@chakra-ui/react";
import React from "react";

import SignInForm from "./form";

function LoginComponent({ forward }) {
  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xs" width="full" pb={4}>
        <SignInForm forward={forward} />
      </Box>
    </Flex>
  );
}

export default LoginComponent;
