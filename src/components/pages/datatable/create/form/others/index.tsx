import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import TextBoxField from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function PartyContributorsForm({ form }) {
  const { t } = useTranslation();

  return (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>👥 {t("Others")}</BoxHeading>
      <TextBoxField name="project" label={t("Project")} form={form} />

      <TextBoxField name="methods" label={t("Methods")} form={form} />
    </Box>
  );
}
