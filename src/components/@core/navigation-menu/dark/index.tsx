import { Box, useDisclosure } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import Router from "next/router";
import React, { useEffect } from "react";

import PrimaryLogo from "./left-menu/logo";
import RightMenu from "./right-menu";

export default function NavigationMenuDark() {
  const { open, onToggle, onClose } = useDisclosure();

  useEffect(() => {
    Router.events.on("routeChangeStart", onClose);
  }, []);

  const DarkMenuContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 1024px) {
      flex-direction: column;
      align-items: flex-start;
    }

    ${Mq.min.md + " and (max-width: 1024px)"} {
      align-items: center;
      padding-bottom: 0.6rem;
    }
  `;

  return (
    <Box bg="gray.800" color="white">
      <DarkMenuContainer className="container-fluid">
        <PrimaryLogo isOpen={open} onToggle={onToggle} />
        <RightMenu isOpen={open} />
      </DarkMenuContainer>
    </Box>
  );
}
