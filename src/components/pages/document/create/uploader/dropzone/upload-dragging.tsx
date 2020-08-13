import { Flex, Icon } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function UploadDragging() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" alignItems="center" className="fade">
      <Icon name="arrow-up" mb={4} fontSize="3xl" />
      <span>{t("OBSERVATION.UPLOADER.LABEL_RELEASE")}</span>
    </Flex>
  );
}
