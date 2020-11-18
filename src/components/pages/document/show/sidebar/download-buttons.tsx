import { Button, SimpleGrid } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import DownloadIcon from "@icons/download";
import PeopleIcon from "@icons/people";
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
        leftIcon={<DownloadIcon />}
        onClick={downloadPDF}
        isDisabled={!documentPath}
        colorScheme="red"
      >
        {t("DOCUMENT.DOWNLOAD.PDF")}
      </Button>
      <Button variant="outline" leftIcon={<PeopleIcon />} colorScheme="teal">
        {t("DOCUMENT.DOWNLOAD.CITATION")}
      </Button>
    </SimpleGrid>
  );
}
