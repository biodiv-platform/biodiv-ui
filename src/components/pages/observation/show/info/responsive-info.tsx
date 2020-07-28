import { Box, Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export const ResponsiveInfo = ({ title, children }) => {
  const { t } = useTranslation();

  return (
    <>
      <Text fontWeight={600}>{t(title)}</Text>
      <Box gridColumn={[1, 1, "2/6", "2/6"]} mb={[4, 4, 0, 0]}>
        {children}
      </Box>
    </>
  );
};
