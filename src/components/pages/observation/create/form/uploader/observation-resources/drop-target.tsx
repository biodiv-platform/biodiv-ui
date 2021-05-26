import { Button, Heading, Text } from "@chakra-ui/react";
import { ArrowUpIcon, TimeIcon } from "@chakra-ui/icons";
import useTranslation from "@hooks/use-translation";
import styled from "@emotion/styled";
import { resizeMultiple } from "@utils/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import useObservationCreate from "../use-observation-resources";

const DropTargetBox = styled.div`
  border: 2px dashed var(--gray-300);
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 22rem;
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

export const accept = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "video/*",
  "audio/*",
  "application/zip",
  "application/x-zip-compressed"
];

export default function DropTarget({ assetsSize }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();
  const { addAssets } = useObservationCreate();

  const handleOnDrop = async (files) => {
    setIsProcessing(true);
    const resizedAssets = await resizeMultiple(files);

    addAssets(resizedAssets, true);
    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    accept
  });

  return (
    <DropTargetBox
      {...getRootProps()}
      data-has-resources={!!assetsSize}
      data-dropping={isDragActive}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="fade">
          <TimeIcon />
          <span>{t("OBSERVATION.UPLOADER.PROCESSING")}</span>
        </div>
      ) : isDragActive ? (
        <div className="fade">
          <ArrowUpIcon />
          <span>{t("OBSERVATION.UPLOADER.LABEL_RELEASE")}</span>
        </div>
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
