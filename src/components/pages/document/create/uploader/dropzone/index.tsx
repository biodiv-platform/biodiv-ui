import { Box, FileUpload } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";

import useManageDocument from "../document-upload-provider";
import DocumentPreview from "./document-preview";
import UploadDragging from "./upload-dragging";
import UploadInfo from "./upload-info";
import UploadProcessing from "./upload-processing";

const accept = {
  "application/pdf": [".pdf"],
  "video/*": [".mp4", ".MP4", ".mov", ".MOV", ".webm", ".WEBM"]
};

const ACCEPT_STRING = Object.keys(accept).join(",");

export default function DocumentDropzone() {
  const { selectedDocument, addDocument } = useManageDocument();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const file = details.acceptedFiles[0];
      if (!file) {
        return;
      }
      setIsProcessing(true);
      await addDocument(file);
      setIsProcessing(false);
    },
    [addDocument]
  );

  return (
    <Box>
      <DocumentPreview />

      <FileUpload.Root
        accept={ACCEPT_STRING}
        onFileChange={handleFileChange}
        maxFiles={1}
        width="full"
      >
        <FileUpload.HiddenInput />

        <FileUpload.Context>
          {(fileUpload) => (
            <FileUpload.Dropzone
              border="2px dashed"
              borderColor={fileUpload.dragging ? "blue.500" : "gray.300"}
              borderRadius="0.5rem"
              p={4}
              height={selectedDocument ? "10rem" : "14.4rem"}
              mt={selectedDocument ? 4 : 0}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              width="full"
              bg={fileUpload.dragging ? "blue.50" : "transparent"}
              css={{
                "& > div": {
                  textAlign: "center",
                  width: "100%"
                }
              }}
            >
              {isProcessing ? (
                <UploadProcessing />
              ) : fileUpload.dragging ? (
                <UploadDragging />
              ) : (
                <UploadInfo />
              )}
            </FileUpload.Dropzone>
          )}
        </FileUpload.Context>
      </FileUpload.Root>
    </Box>
  );
}
