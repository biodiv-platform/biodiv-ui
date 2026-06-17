import { Button, FileUpload, Heading, Text, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ACCEPTED_FILE_TYPES } from "@static/observation-create";
import { resizeMultiple } from "@utils/image";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useState } from "react";
import { LuTimer } from "react-icons/lu";

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

const ACCEPT_STRING =
  typeof ACCEPTED_FILE_TYPES === "object" && !Array.isArray(ACCEPTED_FILE_TYPES)
    ? Object.keys(ACCEPTED_FILE_TYPES).join(",")
    : Array.isArray(ACCEPTED_FILE_TYPES)
    ? ACCEPTED_FILE_TYPES.join(",")
    : ACCEPTED_FILE_TYPES || "image/*,video/*";

export default function DropTarget({ assetsSize }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();
  const { addAssets } = useObservationCreate();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const { acceptedFiles, rejectedFiles } = details;

      if (rejectedFiles && rejectedFiles.length > 0) {
        rejectedFiles.forEach((file) => {
          const ext = "." + file.name.substring(file.name.lastIndexOf(".") + 1);
          notification(`${ext} format not supported`);
        });
        return;
      }

      if (acceptedFiles.length > 0) {
        setIsProcessing(true);
        try {
          const resizedAssets = await resizeMultiple(acceptedFiles);
          addAssets(resizedAssets, true);
        } catch (error) {
          console.error(error);
        } finally {
          setIsProcessing(false);
        }
      }
    },
    [addAssets]
  );

  return (
    <DropTargetBox data-has-resources={!!assetsSize}>
      {isProcessing ? (
        <div className="fade">
          <LuTimer />
          <span>{t("form:uploader.processing")}</span>
        </div>
      ) : (
        <VStack className="fade" width="full" gap={2}>
          <FileUpload.Root
            accept={ACCEPT_STRING}
            onFileChange={handleFileChange}
            width="full"
            maxFiles={10}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone border="none" bg="transparent" p={0} minH="auto" width="full">
              <FileUpload.DropzoneContent display="flex" flexDirection="column" alignItems="center">
                <Heading size="md">{t("form:uploader.label")}</Heading>
                <Text color="gray.500">{t("common:or")}</Text>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
          </FileUpload.Root>

          <FileUpload.Root
            accept={ACCEPT_STRING}
            onFileChange={handleFileChange}
            width={{ base: "full", sm: "auto" }}
            maxFiles={10}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
              <Button colorPalette="blue" variant="outline" width="full" justifyContent="center">
                {t("form:uploader.browse")}
              </Button>
            </FileUpload.Trigger>
          </FileUpload.Root>
        </VStack>
      )}
    </DropTargetBox>
  );
}
