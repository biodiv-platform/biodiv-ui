import { Button, Heading, Text } from "@chakra-ui/core";
import { TimeIcon } from "@chakra-ui/icons";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { axUploadResource } from "@services/files.service";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropTargetBox = styled.div`
  border: 2px dashed var(--gray-300);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > div {
    text-align: center;
  }
  &[data-dropping="true"] {
    border-color: var(--blue-500);
  }
  &[data-has-resources="false"] {
    grid-column: 1/6;
  }

  svg {
    display: block;
    font-size: 2.5rem;
    margin: 0 auto;
    margin-bottom: 0.5rem;
  }
`;

const accept = ["image/jpg", "image/jpeg", "image/png"];

interface userGroupDropTarget {
  setValue;
  nestedPath?;
  simpleUpload?: boolean;
}

export default function DropTarget({ setValue, nestedPath, simpleUpload }: userGroupDropTarget) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const onDrop = async (files) => {
    setIsProcessing(true);
    if (files.length) {
      const { success, data } = await axUploadResource(files[0], "userGroups", nestedPath);
      if (success) {
        setValue(data);
      }
    }
    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false
  });

  return (
    <DropTargetBox
      style={{ minHeight: simpleUpload ? "6rem" : "13rem" }}
      {...getRootProps()}
      data-dropping={isDragActive}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="fade">
          <TimeIcon />
          <span>{t("OBSERVATION.UPLOADER.PROCESSING")}</span>
        </div>
      ) : simpleUpload ? (
        <Button colorScheme="blue" variant="outline" children={t("OBSERVATION.UPLOADER.UPLOAD")} />
      ) : (
        <div className="fade">
          <Heading size="md">{t("OBSERVATION.UPLOADER.LABEL")}</Heading>
          <Text my={2} color="gray.500">
            {t("OR")}
          </Text>
          <Button
            colorScheme="blue"
            variant="outline"
            children={t("OBSERVATION.UPLOADER.BROWSE")}
          />
        </div>
      )}
    </DropTargetBox>
  );
}
