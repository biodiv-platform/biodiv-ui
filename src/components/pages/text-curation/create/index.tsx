import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import TextCurationCreateForm from "./form";

export default function TextCurationCreateComponent() {
  const { t } = useTranslation();

  return (
    <Box className="container mt" mb={6}>
      <PageHeading>{t("text-curation:create.title")}</PageHeading>
      <TextCurationCreateForm />
    </Box>
  );
}
