import { Button, Heading, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function UploadInfo() {
  const { t } = useTranslation();

  return (
    <>
      <div className="fade">
        <Heading size="md">{t("document:upload.label")}</Heading>
        <Text my={2} color="gray.500">
          {t("common:or")}
        </Text>
        <Button colorScheme="blue" variant="outline" children={t("form:uploader.browse")} />
      </div>
      <Text my={2} color="gray.500">
        {t("document:upload.supported_formats")}
      </Text>
    </>
  );
}
