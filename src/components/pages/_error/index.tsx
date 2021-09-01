import styled from "@emotion/styled";
import { getFriendlyError } from "friendly-http-status";
import React from "react";

const ErrorContainer = styled.div`
  height: calc(100vh - var(--heading-height));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--chakra-colors-gray-900);

  h1 {
    font-size: 2.2rem;
    padding-right: 12px;
    margin-bottom: 2rem;
    animation: type 0.5s alternate infinite;
  }

  p {
    max-width: 400px;
    text-align: center;
    color: var(--chakra-colors-gray-500);
  }

  @keyframes type {
    from {
      box-shadow: inset -3px 0px 0px var(--chakra-colors-gray-900);
    }

    to {
      box-shadow: inset -3px 0px 0px transparent;
    }
  }
`;

function ErrorPage({ statusCode = -1 }) {
  const errorMessage = getFriendlyError(statusCode);
  return (
    <ErrorContainer>
      <h1>
        {errorMessage.emoji} {statusCode}: {errorMessage.message}
      </h1>
      <p>{errorMessage.description}</p>
    </ErrorContainer>
  );
}

export default ErrorPage;
