import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import useLayerUpload from "../use-layer-upload";

export default function FormUploadMessage() {
  const { uploadStatus } = useLayerUpload();
  const { t } = useTranslation();
  const data: any = useMemo(
    () =>
      uploadStatus === null
        ? { status: "info", message: t("map:upload_progress") }
        : uploadStatus
        ? { status: "success", message: t("map:upload_success") }
        : { status: "error", message: t("map:upload_error") },
    [uploadStatus]
  );

  return (
    <Alert
      status={data.status}
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      h="100%"
      borderRadius="md"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {data.message}
      </AlertTitle>
    </Alert>
  );
}
