import { Button, Heading, Icon, Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { axUploadUserGroupResource } from "@services/files.service";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropTargetBox = styled.div`
  border: 2px dashed var(--gray-300);
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 13rem;
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

export const accept = ["image/jpg", "image/jpeg", "image/png"];

export default function DropTarget({ setValue }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const onDrop = async (files) => {
    setIsProcessing(true);
    if (files.length) {
      const { success, data } = await axUploadUserGroupResource(files[0]);
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
    <DropTargetBox {...getRootProps()} data-dropping={isDragActive}>
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="fade">
          <Icon name="time" />
          <span>{t("OBSERVATION.UPLOADER.PROCESSING")}</span>
        </div>
      ) : (
        <div className="fade">
          <Heading size="md">{t("OBSERVATION.UPLOADER.LABEL")}</Heading>
          <Text my={2} color="gray.500">
            {t("OR")}
          </Text>
          <Button
            variantColor="blue"
            variant="outline"
            children={t("OBSERVATION.UPLOADER.BROWSE")}
          />
        </div>
      )}
    </DropTargetBox>
  );
}