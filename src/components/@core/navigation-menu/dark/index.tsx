import { Box, useDisclosure } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import React, { useEffect } from "react";

import PrimaryLogo from "./left-menu/logo";
import RightMenu from "./right-menu";
import Router from "next/router";

const DarkMenuContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${Mq.max.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function NavigationMenuDark() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  useEffect(() => {
    Router.events.on("routeChangeStart", onClose);
  }, []);

  return (
    <Box bg="gray.800" color="white">
      <DarkMenuContainer className="container-fluid">
        <PrimaryLogo isOpen={isOpen} onToggle={onToggle} />
        <RightMenu isOpen={isOpen} />
      </DarkMenuContainer>
    </Box>
  );
}
