import { Heading, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";

import NotFoundIllustration from "./illustration";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
  svg {
    width: 500px;
    max-width: 90%;
    height: auto;
  }
`;

export default function PageNotFoundComponent() {
  return (
    <NotFoundContainer className="container">
      <NotFoundIllustration />
      <Heading mt={10} mb={4}>
        404: Not Found
      </Heading>
      <Text>We looked everywhere, but this page just wasn&apos;t there.</Text>
    </NotFoundContainer>
  );
}
