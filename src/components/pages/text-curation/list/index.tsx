import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import View from "./view";

export default function TextCurationListPage({ data }) {
  return (
    <Box className="container mt">
      <PageHeading>📚 Datasheets</PageHeading>

      {data.map((d) => (
        <View d={d} />
      ))}
    </Box>
  );
}
