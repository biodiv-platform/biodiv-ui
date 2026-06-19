import { AspectRatio, FileUpload, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ACCEPTED_FILE_TYPES } from "@static/observation-create";
import { resizeMultiple } from "@utils/image";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useState } from "react";
import { LuMoveUp, LuPlus, LuTimer } from "react-icons/lu";

import useObservationCreate from "../use-observation-resources";

const DropTargetBox = styled.div`
  cursor: pointer;
  border: 2px dashed var(--chakra-colors-gray-300);
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
  > div {
    text-align: center;
    width: 100%;
  }
  &[data-dropping="true"] {
    border-color: var(--chakra-colors-blue-500);
  }
  svg {
    display: block;
    font-size: 1.8rem;
    margin: 0 auto;
  }
`;

const ACCEPT_STRING =
  typeof ACCEPTED_FILE_TYPES === "object" && !Array.isArray(ACCEPTED_FILE_TYPES)
    ? Object.keys(ACCEPTED_FILE_TYPES).join(",")
    : Array.isArray(ACCEPTED_FILE_TYPES)
    ? ACCEPTED_FILE_TYPES.join(",")
    : ACCEPTED_FILE_TYPES || "image/*,video/*";

export default function DropTarget() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();
  const { addAssets } = useObservationCreate();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      if (details.acceptedFiles.length === 0) return;

      setIsProcessing(true);
      try {
        const resizedAssets = await resizeMultiple(details.acceptedFiles);
        addAssets(resizedAssets, false);
      } catch (error) {
        console.error("Asset processing failed:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [addAssets]
  );

  return (
    <AspectRatio ratio={1}>
      <FileUpload.Root
        accept={ACCEPT_STRING}
        onFileChange={handleFileChange}
        width="full"
        height="full"
      >
        <FileUpload.HiddenInput />

        <FileUpload.Dropzone
          asChild
          border="none"
          bg="transparent"
          p={0}
          height="full"
          width="full"
          minH="auto"
        >
          <FileUpload.Trigger asChild>
            <DropTargetBox>
              {isProcessing ? (
                <div className="fade">
                  <LuTimer />
                  <span>{t("form:uploader.processing")}</span>
                </div>
              ) : (
                <FileUpload.Context>
                  {(fileUpload) =>
                    fileUpload.dragging ? (
                      <div className="fade">
                        <LuMoveUp />
                        <span>{t("form:uploader.label_release")}</span>
                      </div>
                    ) : (
                      <Text my={2} color="gray.500">
                        <LuPlus />
                      </Text>
                    )
                  }
                </FileUpload.Context>
              )}
            </DropTargetBox>
          </FileUpload.Trigger>
        </FileUpload.Dropzone>
      </FileUpload.Root>
    </AspectRatio>
  );
}
