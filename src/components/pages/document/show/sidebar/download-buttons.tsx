import { Button, SimpleGrid } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axDownloadDocument } from "@services/document.service";
import { waitForAuth } from "@utils/auth";
import { sendFileFromResponse } from "@utils/download";
import { getDocumentFilePath } from "@utils/media";
import React from "react";

export default function DownloadButtons({ documentPath, documentId, title }) {
  const { t } = useTranslation();

  const downloadPDF = async () => {
    await waitForAuth();
    const fileName = `${title}.pdf`;
    const fullFilePath = getDocumentFilePath(documentPath);
    const { success, data } = await axDownloadDocument(fullFilePath, documentId);
    if (success) {
      sendFileFromResponse(data, fileName);
    }
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} mb={4} spacing={4}>
      <Button
        variant="outline"
        leftIcon={"download" as any}
        onClick={downloadPDF}
        variantColor="red"
      >
        {t("DOCUMENT.DOWNLOAD.PDF")}
      </Button>
      <Button variant="outline" leftIcon={"people" as any} variantColor="teal">
        {t("DOCUMENT.DOWNLOAD.CITATION")}
      </Button>
    </SimpleGrid>
  );
}
