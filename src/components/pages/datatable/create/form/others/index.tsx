import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import SwitchField from "@components/form/switch";
import TextBoxField from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import React from "react";

export default function PartyContributorsForm({ form }) {
  const { t } = useTranslation();

  const isAdmin = hasAccess([Role.Admin]);

  return (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>✅{t("DATATABLE.OTHERS")}</BoxHeading>
      <TextBoxField name="project" label={t("DATATABLE.PROJECT")} form={form} />

      <TextBoxField name="methods" label={t("DATATABLE.METHODS")} form={form} />

      {isAdmin && <SwitchField name="isVerified" label={t("DATATABLE.IS_VERIFIED")} form={form} />}
    </Box>
  );
}
