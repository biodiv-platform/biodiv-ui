import { Button, Heading, Icon, Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { IDBObservationAsset } from "@interfaces/custom";
import { axUploadUserGroupResource } from "@services/files.service";
import { resizeMultiple } from "@utils/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropTargetBox = styled.div`
  border: 2px dashed var(--gray-300);
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 10rem;
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

export const accept = ["image/jpg", "image/jpeg", "image/png", "video/*", "audio/*"];

export default function DropTarget({ setValue }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();
  const handleOnDrop = async (files) => {
    try {
      setIsProcessing(true);
      const resizedAssets = await resizeMultiple(files);
      const assets = resizedAssets.map((item: IDBObservationAsset) => item);
      const data = await axUploadUserGroupResource(assets[0]);
      const { uri, ...others } = data;
      setValue({ path: uri, ...others });
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    accept
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
