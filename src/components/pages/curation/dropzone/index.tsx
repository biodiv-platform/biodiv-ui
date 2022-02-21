import { Box } from "@chakra-ui/react";
import UploadDragging from "@components/pages/document/create/uploader/dropzone/upload-dragging";
import UploadInfo from "@components/pages/document/create/uploader/dropzone/upload-info";
import UploadProcessing from "@components/pages/document/create/uploader/dropzone/upload-processing";
import styled from "@emotion/styled";
import { MyCsvUpload } from "@interfaces/files";
import { axUploadCsvCurationResource } from "@services/files.service";
import { stringify } from "querystring";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

//import useFileHeaders from "./use-file-headers";

/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

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

const addCsvFile = async (file, setter, setterFilePath, userId) => {
  const resource = await axUploadCsvCurationResource(file);

  //console.log(resource.path);

  setter(resource.excelJson?.csvHeaders);
  const absFilePath = `/app/biodiv-image/myUploads/${userId}${resource.path}`;
  setterFilePath(absFilePath);

  console.log(absFilePath);

  //path = resource.path;
};
export default function CsvDropzoneComponent({ setCsvHeaders, setFilePath, userId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const [columns, setColumns] = useState<object>();

  const handleOnDrop = async ([file]) => {
    if (!file) {
      return;
    }

    setIsProcessing(true);
    await addCsvFile(file, setCsvHeaders, setFilePath, userId);

    setIsProcessing(false);
  };

  const accept = ".csv";

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    accept,
    multiple: false
  });

  return (
    <Box>
      <DropTargetBox {...getRootProps()} data-dropping={isDragActive}>
        <input {...getInputProps()} />
        {isProcessing ? <UploadProcessing /> : isDragActive ? <UploadDragging /> : <UploadInfo />}
        <div></div>
      </DropTargetBox>
    </Box>
  );
}
