import { Box } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function LifeList() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeading size="md">📃 {t("USER.OBSERVATIONS.LIFE_LIST")}</PageHeading>
      <Box as="hr" mb={3} />
    </>
  );
}
