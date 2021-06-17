import { Box, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

interface ResponsiveInfoProps {
  title?;
  children?;
  isHtml?;
}

export const ResponsiveInfo = ({ title, children, isHtml }: ResponsiveInfoProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Text fontWeight={600}>{t(title)}</Text>
      <Box gridColumn={[1, 1, "2/6", "2/6"]} mb={[4, 4, 0, 0]} whiteSpace="pre-line">
        {isHtml ? <span dangerouslySetInnerHTML={{ __html: children }} /> : children}
      </Box>
    </>
  );
};
