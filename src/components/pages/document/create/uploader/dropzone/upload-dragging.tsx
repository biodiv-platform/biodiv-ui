import { Flex } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuArrowUp } from "react-icons/lu";

export default function UploadDragging() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" alignItems="center" className="fade">
      <LuArrowUp fontSize="3xl" />
      <span>{t("form:uploader.label_release")}</span>
    </Flex>
  );
}
