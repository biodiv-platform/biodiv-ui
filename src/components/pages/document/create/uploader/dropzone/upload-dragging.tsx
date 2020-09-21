import { Flex } from "@chakra-ui/core";
import { ArrowUpIcon } from "@chakra-ui/icons";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function UploadDragging() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" alignItems="center" className="fade">
      <ArrowUpIcon mb={4} fontSize="3xl" />
      <span>{t("OBSERVATION.UPLOADER.LABEL_RELEASE")}</span>
    </Flex>
  );
}
