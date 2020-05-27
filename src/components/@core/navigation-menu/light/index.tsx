import { Box, useDisclosure } from "@chakra-ui/core";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import Router from "next/router";
import React, { useEffect } from "react";

import PrimaryLogo from "./left-menu/logo";
import RightMenu from "./right-menu";

const LightMenuContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${Mq.max.md} {
    flex-direction: column;
    align-items: flex-start;
  }

  ${Mq.min.md + " and (max-width: 768px)"} {
    align-items: center;
    padding-bottom: 0.6rem;
  }
`;

export default function NavigationMenuLight() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  useEffect(() => {
    Router.events.on("routeChangeStart", onClose);
  }, []);

  return (
    <Box borderBottom="1px solid" bg="white" borderColor="gray.300">
      <LightMenuContainer className="container-fluid">
        <PrimaryLogo isOpen={isOpen} onToggle={onToggle} />
        <RightMenu isOpen={isOpen} />
      </LightMenuContainer>
    </Box>
  );
}
