import { Box, Button, Heading, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { axUploadResource } from "@services/files.service";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuTimer } from "react-icons/lu";

const DropTargetBox = styled.div`
  border: 2px dashed var(--chakra-colors-gray-300);
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

const accept = { "image/*": [".jpg", ".jpeg", ".png"] };

interface userGroupDropTarget {
  setValue;
  resourcePath?;
  nestedPath?;
  simpleUpload?: boolean;
}

export default function DropTarget({
  setValue,
  resourcePath = "userGroups",
  nestedPath,
  simpleUpload
}: userGroupDropTarget) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const onDrop = async (files) => {
    setIsProcessing(true);
    if (files.length) {
      const { success, data } = await axUploadResource(files[0], resourcePath, nestedPath);
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
    <Box width={"full"}>
      <DropTargetBox
        style={{ minHeight: simpleUpload ? "6rem" : "13rem" }}
        {...getRootProps()}
        data-dropping={isDragActive}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <div className="fade">
            <LuTimer />
            <span>{t("form:uploader.processing")}</span>
          </div>
        ) : simpleUpload ? (
          <Button colorPalette="blue" variant="outline" children={t("form:uploader.upload")} />
        ) : (
          <div className="fade">
            <Heading size="md">{t("form:uploader.label")}</Heading>
            <Text my={2} color="gray.500">
              {t("common:or")}
            </Text>
            <Button colorPalette="blue" variant="outline" children={t("form:uploader.browse")} />
          </div>
        )}
      </DropTargetBox>
    </Box>
  );
}
