import { Box } from "@chakra-ui/react";
import UploadDragging from "@components/pages/document/create/uploader/dropzone/upload-dragging";
import UploadInfo from "@components/pages/document/create/uploader/dropzone/upload-info";
import UploadProcessing from "@components/pages/document/create/uploader/dropzone/upload-processing";
import styled from "@emotion/styled";
import useGlobalState from "@hooks/use-global-state";
import { axUploadCSVCurationResource } from "@services/files.service";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

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

export default function CSVDropzoneComponent({ name, setHeaders }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useGlobalState();

  const form = useFormContext();

  const handleOnDrop = async ([file]) => {
    if (!file) return;

    setIsProcessing(true);

    const resource = await axUploadCSVCurationResource(file);

    form.setValue(name, `/app/data/biodiv/myUploads/${user.id}${resource.path}`);
    setHeaders(resource.excelJson?.csvHeaders.map((title) => ({ label: title, value: title })));

    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    accept: ".csv",
    multiple: false
  });

  return (
    <Box mb={4}>
      <DropTargetBox {...getRootProps()} data-dropping={isDragActive}>
        <input {...getInputProps()} />
        {isProcessing ? <UploadProcessing /> : isDragActive ? <UploadDragging /> : <UploadInfo />}
        <div></div>
      </DropTargetBox>
    </Box>
  );
}
