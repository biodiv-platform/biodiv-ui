import { Box, Button, FileUpload, Heading, Text, VStack } from "@chakra-ui/react";
import { axUploadObservationResource } from "@services/files.service";
import { getAssetObject } from "@utils/image";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useState } from "react";
import { LuTimer } from "react-icons/lu";

const accept = {
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
};

const ACCEPT_STRING = Object.keys(accept).join(",");

interface userGroupDropTarget {
  field;
  setFieldMapping;
  setShowMapping;
  simpleUpload?: boolean;
}

export default function DropTarget({
  field,
  simpleUpload,
  setFieldMapping,
  setShowMapping
}: userGroupDropTarget) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const file = details.acceptedFiles[0];

      if (!file) {
        return;
      }

      setIsProcessing(true);

      const { success, data } = await axUploadObservationResource(getAssetObject(file), "datasets");
      if (success) {
        setFieldMapping(data.excelJson);
        field.onChange(data.path);
        setShowMapping(true);
        notification(t("datatable:notifications.sheet_upload_success"), NotificationType.Success);
      } else {
        notification(t("datatable:notifications.sheet_upload_error"), NotificationType.Error);
      }

      setIsProcessing(false);
    },
    [field, setFieldMapping, setShowMapping, t]
  );

  return (
    <FileUpload.Root
      accept={ACCEPT_STRING}
      onFileChange={handleFileChange}
      maxFiles={1}
      width="full"
    >
      <FileUpload.HiddenInput />

      <FileUpload.Context>
        {(fileUpload) => (
          <FileUpload.Dropzone
            border="2px dashed"
            borderColor={fileUpload.dragging ? "blue.500" : "gray.300"}
            borderRadius="0.5rem"
            p={4}
            minH={simpleUpload ? "6rem" : "13rem"}
            width="full"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            bg={fileUpload.dragging ? "blue.50" : "transparent"}
          >
            {isProcessing ? (
              <VStack className="fade" gap={2}>
                <Box fontSize="2.5rem" color="gray.600">
                  <LuTimer />
                </Box>
                <Text>{t("form:uploader.processing")}</Text>
              </VStack>
            ) : simpleUpload ? (
              <Button as="span" colorPalette="blue" variant="outline">
                {t("form:uploader.upload")}
              </Button>
            ) : (
              <VStack className="fade" width="full" gap={2} textAlign="center">
                <Heading size="md">{t("form:uploader.label")}</Heading>
                <Text my={2} color="gray.500">
                  {t("common:or")}
                </Text>
                <Button as="span" colorPalette="blue" variant="outline">
                  {t("form:uploader.browse")}
                </Button>
              </VStack>
            )}
          </FileUpload.Dropzone>
        )}
      </FileUpload.Context>
    </FileUpload.Root>
  );
}
