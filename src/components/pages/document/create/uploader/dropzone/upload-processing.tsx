import { Flex } from "@chakra-ui/core";
import { TimeIcon } from "@chakra-ui/icons";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function UploadProcessing() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" alignItems="center" className="fade">
      <TimeIcon mb={4} fontSize="3xl" />
      <span>{t("OBSERVATION.UPLOADER.PROCESSING")}</span>
    </Flex>
  );
}
