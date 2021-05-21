import { Box } from "@chakra-ui/react";
import { SwitchField } from "@components/form/switch";
import { TextBoxField } from "@components/form/text";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import useTranslation from "@hooks/use-translation";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import React from "react";

export default function PartyContributorsForm() {
  const { t } = useTranslation();
  const isAdmin = hasAccess([Role.Admin]);

  return (
    <ToggleablePanel icon="✅" title={t("DATATABLE.OTHERS")}>
      <Box p={4} pb={0}>
        <TextBoxField name="project" label={t("DATATABLE.PROJECT")} />
        <TextBoxField name="methods" label={t("DATATABLE.METHODS")} />
        {isAdmin && <SwitchField name="isVerified" label={t("DATATABLE.IS_VERIFIED")} />}
      </Box>
    </ToggleablePanel>
  );
}
