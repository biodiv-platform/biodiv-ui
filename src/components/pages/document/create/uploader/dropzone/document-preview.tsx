import { SimpleGrid } from "@chakra-ui/react";
import React from "react";

import FilePreview from "../common/file-preview";
import useManageDocument from "../document-upload-provider";

export default function DocumentPreview() {
  const { selectedDocument, clearSelectedDocument } = useManageDocument();

  return selectedDocument ? (
    <SimpleGrid columns={[1, 2, 2, 3]}>
      <FilePreview
        fileName={selectedDocument?.resourceURL?.replace(/^.*[\\\/]/, "")}
        date={selectedDocument.timestamp}
        onDelete={clearSelectedDocument}
      />
    </SimpleGrid>
  ) : null;
}
