import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Router from "next/router";
import React, { useEffect } from "react";

import PrimaryLogo from "./left-menu/logo";
import RightMenu from "./right-menu";

export default function NavigationMenuDark() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  useEffect(() => {
    Router.events.on("routeChangeStart", onClose);
  }, []);

  return (
    <Box bg="gray.800" color="white">
      <Flex
        justifyContent={{ md: "space-between" }}
        alignItems={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        className="container-fluid"
      >
        <PrimaryLogo isOpen={isOpen} onToggle={onToggle} />
        <RightMenu isOpen={isOpen} />
      </Flex>
    </Box>
  );
}
