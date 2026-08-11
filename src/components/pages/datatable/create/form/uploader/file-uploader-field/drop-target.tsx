import { Button, FileUpload, Heading, Text, VStack } from "@chakra-ui/react";
import { getAssetObject } from "@utils/image";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useState } from "react";

import UploadProcessing from "@/components/pages/document/create/uploader/dropzone/upload-processing";
import { axTusUploadObservationResource, MAX_UPLOAD_SIZE } from "@/services/tusupload.service";

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

  const [progress, setProgress] = useState<number | undefined>(undefined);

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const file = details.acceptedFiles[0];

      if (!file) {
        return;
      }

      setIsProcessing(true);
      setProgress(0);

      const { success, data } = await axTusUploadObservationResource(
        getAssetObject(file),
        "datasets",
        (percent) => setProgress(percent)
      );

      if (success) {
        setFieldMapping(data.excelJson);
        field.onChange(data.path);
        setShowMapping(true);
        notification(t("datatable:notifications.sheet_upload_success"), NotificationType.Success);
      } else {
        notification(t("datatable:notifications.sheet_upload_error"), NotificationType.Error);
      }

      setIsProcessing(false);
      setProgress(undefined);
    },
    [field, setFieldMapping, setShowMapping, t]
  );

  return (
    <FileUpload.Root
      accept={ACCEPT_STRING}
      onFileChange={handleFileChange}
      maxFiles={1}
      width="full"
      maxFileSize={MAX_UPLOAD_SIZE}
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
              <UploadProcessing progress={progress} />
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
