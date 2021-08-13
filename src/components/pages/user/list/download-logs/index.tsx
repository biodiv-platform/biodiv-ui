import { Box, Text } from "@chakra-ui/react";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useDownloadLogsList from "../../common/use-download-log";
import Views from "./table";

export default function DownloadLogListComponent() {
  const { downloadLogData } = useDownloadLogsList();
  const { t } = useTranslation();

  return (
    <Box w="full" maxH="calc( 100vh - var(--heading-height) )" display="flex">
      <Box
        maxH="full"
        w="full"
        id="items-container"
        overflowY="auto"
        gridColumn={{ lg: "4/15" }}
        px={4}
      >
        {downloadLogData && downloadLogData.n > 0 && (
          <Text color="gray.600" mt={4}>
            {format(downloadLogData.n)} {t("user:download_logs")}
          </Text>
        )}
        <Views />
      </Box>
    </Box>
  );
}
