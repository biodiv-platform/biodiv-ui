import { Button, SimpleGrid } from "@chakra-ui/react";
import DownloadIcon from "@icons/download";
import PeopleIcon from "@icons/people";
import { axDownloadDocument } from "@services/document.service";
import { isBrowser } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import { sendFileFromResponse } from "@utils/download";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function DownloadButtons({ documentPath, documentId, title }) {
  const { t } = useTranslation();

  const downloadPDF = async () => {
    await waitForAuth();
    const fileName = `${title}.pdf`;
    const { success, data } = await axDownloadDocument(
      `/content/documents${documentPath}`,
      documentId,
      title
    );
    if (success) {
      sendFileFromResponse(data, fileName);
    }
  };

  const openZbib = () => {
    if (isBrowser) {
      window.open(`https://zbib.org/import?q=${window.location.href}`, "_blank")?.focus();
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
        {t("document:download.pdf")}
      </Button>
      <Button variant="outline" leftIcon={<PeopleIcon />} onClick={openZbib} colorScheme="teal">
        {t("document:download.citation")}
      </Button>
    </SimpleGrid>
  );
}
