import { ArrowUpIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function UploadDragging() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" alignItems="center" className="fade">
      <ArrowUpIcon mb={4} fontSize="3xl" />
      <span>{t("form:uploader.label_release")}</span>
    </Flex>
  );
}
