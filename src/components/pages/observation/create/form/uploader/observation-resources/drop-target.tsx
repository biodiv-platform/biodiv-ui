import { ArrowUpIcon, TimeIcon } from "@chakra-ui/icons";
import { Button, Heading, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ACCEPTED_FILE_TYPES } from "@static/observation-create";
import { resizeMultiple } from "@utils/image";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import useObservationCreate from "../use-observation-resources";

const DropTargetBox = styled.div`
  border: 2px dashed var(--chakra-colors-gray-300);
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
    border-color: var(--chakra-colors-blue-500);
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

  const handleOnRejected = (files) => {
    files.map((file) => {
      const resourceTypeFileFormat =
        "." + file.file.name.substring(file.file.name.lastIndexOf(".") + 1);
      notification(resourceTypeFileFormat + " format not supported");
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleOnDrop,
    accept: ACCEPTED_FILE_TYPES,
    onDropRejected: handleOnRejected
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
          <span>{t("form:uploader.processing")}</span>
        </div>
      ) : isDragActive ? (
        <div className="fade">
          <ArrowUpIcon />
          <span>{t("form:uploader.label_release")}</span>
        </div>
      ) : (
        <div className="fade">
          <Heading size="md">{t("form:uploader.label")}</Heading>
          <Text my={2} color="gray.500">
            {t("common:or")}
          </Text>
          <Button colorScheme="blue" variant="outline" children={t("form:uploader.browse")} />
        </div>
      )}
    </DropTargetBox>
  );
}
