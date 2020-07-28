import { Button, SimpleGrid } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function DownloadButtons() {
  const { t } = useTranslation();

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} mb={4} spacing={4}>
      <Button variant="outline" leftIcon={"download" as any} variantColor="red">
        {t("DOCUMENT.DOWNLOAD.PDF")}
      </Button>
      <Button variant="outline" leftIcon={"people" as any} variantColor="teal">
        {t("DOCUMENT.DOWNLOAD.CITATION")}
      </Button>
    </SimpleGrid>
  );
}
