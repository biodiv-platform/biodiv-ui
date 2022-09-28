import { Flex, Spinner } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function ResourceUploadIndicator({ children, hidden }) {
  const { t } = useTranslation();

  return (
    <Flex
      px={2}
      py={0.5}
      alignItems="center"
      fontSize="sm"
      position="absolute"
      top={0}
      left={0}
      bg="gray.100"
      m={2}
      borderRadius="md"
      gap={1}
      title={t("observation:sync.uploading")}
      hidden={hidden}
    >
      <Spinner size="xs" />
      {children}
    </Flex>
  );
}
