import { Box, SimpleGrid } from "@chakra-ui/core";
import styled from "@emotion/styled";
import { getDocumentPath } from "@utils/media";
import React from "react";

import DocumentHeader from "./header";
import DocumentInfo from "./info";
import Sidebar from "./sidebar";

const DocumentIframe = styled.iframe`
  background: #3b3b3b;
  border-radius: 0.25rem;
  width: 100%;
  height: 522px;
  grid-column: 1/3;
`;

export default function DocumentShowComponent({ document }) {
  return (
    <div className="container mt">
      <DocumentHeader document={document} />
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]}>
        <DocumentIframe className="fadeInUp delay-2" src={getDocumentPath(document?.uFile?.path)} />
        <Sidebar d={document} />
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]}>
        <Box gridColumn="1/3">
          <DocumentInfo d={document} />
        </Box>
      </SimpleGrid>

      <pre>{JSON.stringify(document, null, 2)}</pre>
    </div>
  );
}
