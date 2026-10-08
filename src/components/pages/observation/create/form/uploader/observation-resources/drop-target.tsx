import { Box, Button, FileUpload, Heading, Text, VStack } from "@chakra-ui/react";
import { ACCEPTED_FILE_TYPES } from "@static/observation-create";
import { resizeMultiple } from "@utils/image";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useState } from "react";
import { LuTimer } from "react-icons/lu";

import { CloseButton } from "@/components/ui/close-button";
import { MAX_UPLOAD_SIZE } from "@/services/tusupload.service";
import { useValidatedFileUpload } from "@/utils/upload-guard";

import useObservationCreate from "../use-observation-resources";

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
      // rejected files are listed under the dropzone with their reason
      const { acceptedFiles } = details;

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

  const { fileUpload, rejections, dismissRejection } = useValidatedFileUpload(
    { accept: ACCEPT_STRING, maxFiles: 10, maxFileSize: MAX_UPLOAD_SIZE },
    handleFileChange,
    "observation",
    { notify: false }
  );

  const hasAssets = !!assetsSize;

  const baseContainerStyles = {
    border: "2px dashed",
    borderColor: "gray.300",
    borderRadius: "md",
    p: 4,
    minH: hasAssets ? "14rem" : "22rem",
    height: hasAssets ? "100%" : "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gridColumn: !hasAssets ? "1/6" : "auto"
  };

  if (isProcessing) {
    return (
      <Box {...baseContainerStyles}>
        <VStack className="fade" gap={2}>
          <Box as={LuTimer} fontSize="2.5rem" mb={2} />
          <Text>{t("form:uploader.processing")}</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <FileUpload.RootProvider
      value={fileUpload}
      width="full"
      style={{ gridColumn: !hasAssets ? "1/6" : "auto" }}
    >
      <FileUpload.HiddenInput />

      <FileUpload.Dropzone
        {...baseContainerStyles}
        width="full"
        cursor="pointer"
        _hover={{ borderColor: "gray.400" }}
        _dragging={{
          borderColor: "blue.500",
          bg: "blue.50",
          _dark: { bg: "blue.950" }
        }}
        css={{
          "& svg": {
            display: "block",
            fontSize: "2.5rem",
            margin: "0 auto 0.5rem auto"
          }
        }}
      >
        <FileUpload.DropzoneContent width="full">
          <VStack className="fade" width="full" gap={hasAssets ? 1 : 3}>
            <Heading size={hasAssets ? "sm" : "md"}>{t("form:uploader.label")}</Heading>
            <Text color="gray.500" fontSize="sm">
              {t("common:or")}
            </Text>

            <FileUpload.Trigger asChild>
              <Button
                size={hasAssets ? "sm" : "md"}
                colorPalette="blue"
                variant="outline"
                justifyContent="center"
              >
                {t("form:uploader.browse")}
              </Button>
            </FileUpload.Trigger>
          </VStack>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>

      {rejections.length > 0 && (
        <FileUpload.ItemGroup>
          {rejections.map((r) => (
            <FileUpload.Item
              key={r.id}
              file={r.file}
              borderColor="red.300"
              bg="red.50"
              _dark={{ borderColor: "red.800", bg: "red.950" }}
            >
              <FileUpload.ItemPreview />
              <FileUpload.ItemContent minW={0}>
                <FileUpload.ItemName truncate />
                <Text fontSize="xs" color="red.600" _dark={{ color: "red.300" }}>
                  {r.message}
                </Text>
              </FileUpload.ItemContent>
              <CloseButton
                size="2xs"
                variant="ghost"
                aria-label="Dismiss"
                onClick={() => dismissRejection(r.id)}
              />
            </FileUpload.Item>
          ))}
        </FileUpload.ItemGroup>
      )}
    </FileUpload.RootProvider>
  );
}
