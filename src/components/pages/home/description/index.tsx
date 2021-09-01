import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { getInjectableHTML } from "@utils/text";
import { Mq } from "mq-styled-components";
import React from "react";

const DescriptionBox = styled.div`
  p {
    margin-bottom: 1rem;
    font-size: 1.125rem;
    color: var(--chakra-colors-gray-600);
  }

  h2,
  h3 {
    margin-top: 0.2rem;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  h3 {
    font-size: 1.5rem;
  }

  .group-partners {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    justify-items: center;
    a,
    img {
      display: inline;
    }
  }

  ${Mq.max.sm} {
    .group-partners {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

export default function HomeDescription({ description, mb = 10 }) {
  return (
    <Box
      mb={mb}
      as={DescriptionBox}
      dangerouslySetInnerHTML={{
        __html: getInjectableHTML(description)
      }}
    ></Box>
  );
}
