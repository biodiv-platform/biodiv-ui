import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import useManageDocument from "../document-upload-provider";
import DocumentPreview from "./document-preview";
import UploadDragging from "./upload-dragging";
import UploadInfo from "./upload-info";
import UploadProcessing from "./upload-processing";

const DropTargetBox = styled.div`
  border: 2px dashed var(--chakra-colors-gray-300);
  border-radius: 0.5rem;
  padding: 1rem;
  height: 14.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > div {
    text-align: center;
  }
  &[data-dropping="true"] {
    border-color: var(--chakra-colors-blue-500);
  }
  &[data-has-resources="true"] {
    height: 10rem;
    margin-top: 1rem;
  }
`;

const accept = ".pdf";

export default function DocumentDropzone() {
  const { selectedDocument, addDocument } = useManageDocument();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOnDrop = async ([file]) => {
    if (!file) {
      return;
    }
    setIsProcessing(true);
    await addDocument(file);
    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    accept,
    multiple: false
  });

  return (
    <Box>
      <DocumentPreview />
      <DropTargetBox
        {...getRootProps()}
        data-has-resources={!!selectedDocument}
        data-dropping={isDragActive}
      >
        <input {...getInputProps()} />
        {isProcessing ? <UploadProcessing /> : isDragActive ? <UploadDragging /> : <UploadInfo />}
      </DropTargetBox>
    </Box>
  );
}
