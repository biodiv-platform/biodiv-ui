import { Box, FileUpload } from "@chakra-ui/react";
import UploadDragging from "@components/pages/document/create/uploader/dropzone/upload-dragging";
import UploadInfo from "@components/pages/document/create/uploader/dropzone/upload-info";
import UploadProcessing from "@components/pages/document/create/uploader/dropzone/upload-processing";
import useGlobalState from "@hooks/use-global-state";
import { axUploadCSVCurationResource } from "@services/files.service";
import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

const ACCEPT_STRING = "text/csv";

export default function CSVDropzoneComponent({ name, setHeaders }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useGlobalState();
  const form = useFormContext();

  const hasResources = !!form.watch(name);

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const file = details.acceptedFiles[0];

      if (!file) return;

      setIsProcessing(true);
      try {
        const resource = await axUploadCSVCurationResource(file);

        form.setValue(name, `/app/data/biodiv/myUploads/${user.id}${resource.path}`);
        setHeaders(resource.excelJson?.csvHeaders.map((title) => ({ label: title, value: title })));
      } catch (error) {
        console.error("CSV upload failed:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [form, name, setHeaders, user.id]
  );

  return (
    <Box mb={4}>
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
              height={hasResources ? "10rem" : "14.4rem"}
              mt={hasResources ? 4 : 0}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              width="full"
              bg={fileUpload.dragging ? "blue.50" : "transparent"}
              css={{
                "& > div": {
                  textAlign: "center"
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
