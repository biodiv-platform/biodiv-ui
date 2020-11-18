import { Button, Heading, Text } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function UploadInfo() {
  const { t } = useTranslation();

  return (
    <div className="fade">
      <Heading size="md">{t("OBSERVATION.UPLOADER.LABEL")}</Heading>
      <Text my={2} color="gray.500">
        {t("OR")}
      </Text>
      <Button colorScheme="blue" variant="outline" children={t("OBSERVATION.UPLOADER.BROWSE")} />
    </div>
  );
}
