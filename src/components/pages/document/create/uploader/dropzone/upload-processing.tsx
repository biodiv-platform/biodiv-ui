import { Flex } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuClock } from "react-icons/lu";

export default function UploadProcessing() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" alignItems="center" className="fade">
      <LuClock fontSize="3xl" />
      <span>{t("form:uploader.processing")}</span>
    </Flex>
  );
}
