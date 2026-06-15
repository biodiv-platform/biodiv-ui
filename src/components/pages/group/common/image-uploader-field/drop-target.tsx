import { Box, Button, FileUpload, Heading, Text, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { axUploadResource } from "@services/files.service";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useState } from "react";
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
    width: 100%;
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

const ACCEPT_STRING = Object.keys(accept).join(",");

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

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const file = details.acceptedFiles[0];
      if (!file) return;

      setIsProcessing(true);
      try {
        const { success, data } = await axUploadResource(file, resourcePath, nestedPath);
        if (success) {
          setValue(data);
        }
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [setValue, resourcePath, nestedPath]
  );

  return (
    <Box width={"full"}>
      <DropTargetBox style={{ minHeight: simpleUpload ? "6rem" : "13rem" }}>
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
              maxFiles={1}
              width="full"
              alignItems="center"
            >
              <FileUpload.HiddenInput />

              {simpleUpload ? (
                <FileUpload.Trigger asChild>
                  <Button colorPalette="blue" variant="outline">
                    {t("form:uploader.upload")}
                  </Button>
                </FileUpload.Trigger>
              ) : (
                <FileUpload.Dropzone border="none" bg="transparent" p={0} minH="auto" width="full">
                  <FileUpload.DropzoneContent
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Heading size="md">{t("form:uploader.label")}</Heading>
                    <Text my={2} color="gray.500">
                      {t("common:or")}
                    </Text>
                    <FileUpload.Trigger asChild>
                      <Button colorPalette="blue" variant="outline">
                        {t("form:uploader.browse")}
                      </Button>
                    </FileUpload.Trigger>
                  </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
              )}
            </FileUpload.Root>
          </VStack>
        )}
      </DropTargetBox>
    </Box>
  );
}
