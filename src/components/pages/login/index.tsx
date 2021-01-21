import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import SignInForm from "./form";

function LoginComponent() {
  const router = useRouter();

  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xs" width="full" pb={4}>
        <SignInForm forward={router.query?.forward} />
      </Box>
    </Flex>
  );
}

export default LoginComponent;
