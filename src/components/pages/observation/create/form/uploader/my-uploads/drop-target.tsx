import { AspectRatio, Text } from "@chakra-ui/core";
import { ArrowUpIcon, TimeIcon } from "@chakra-ui/icons";
import useTranslation from "@hooks/use-translation";
import styled from "@emotion/styled";
import AddIcon from "@icons/add";
import { resizeMultiple } from "@utils/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import { accept } from "../observation-resources/drop-target";
import useObservationCreate from "../use-observation-resources";

const DropTargetBox = styled.div`
  cursor: pointer;
  border: 2px dashed var(--gray-300);
  border-radius: 0.5rem;
  position: absolute;
  text-align: center;
  padding: 1rem;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &[data-dropping="true"] {
    border-color: var(--blue-500);
  }
  svg {
    display: block;
    font-size: 1.8rem;
    margin: 0 auto;
  }
`;

export default function DropTarget() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();
  const { addAssets } = useObservationCreate();

  const handleOnDrop = async (files) => {
    setIsProcessing(true);
    const resizedAssets = await resizeMultiple(files);

    addAssets(resizedAssets, false);
    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    accept
  });

  return (
    <AspectRatio ratio={1}>
      <DropTargetBox {...getRootProps()} data-dropping={isDragActive}>
        <input {...getInputProps()} />
        {isProcessing ? (
          <div className="fade">
            <TimeIcon />
            <span>{t("OBSERVATION.UPLOADER.PROCESSING")}</span>
          </div>
        ) : isDragActive ? (
          <div className="fade">
            <ArrowUpIcon mb={4} />
            <span>{t("OBSERVATION.UPLOADER.LABEL_RELEASE")}</span>
          </div>
        ) : (
          <Text my={2} color="gray.500">
            <AddIcon />
          </Text>
        )}
      </DropTargetBox>
    </AspectRatio>
  );
}
