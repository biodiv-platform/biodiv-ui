import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import View from "./view";

export default function TextCurationListPage({ data }) {
  const { t } = useTranslation();
  return (
    <Box className="container mt">
      <PageHeading>📚 {t("text-curation:list_page.page_heading")}</PageHeading>
      {data.map((d) => (
        <View metadata={d} />
      ))}
    </Box>
  );
}
