import { Box } from "@chakra-ui/react";
import { SwitchField } from "@components/form/switch";
import { TextBoxField } from "@components/form/text";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";

export default function PartyContributorsForm() {
  const { t } = useTranslation();
  const isAdmin = hasAccess([Role.Admin]);

  return (
    <ToggleablePanel icon="✅" title={t("datatable:others")}>
      <Box p={4} pb={0}>
        <TextBoxField name="project" label={t("datatable:project")} />
        <TextBoxField name="methods" label={t("datatable:methods")} />
        {isAdmin && <SwitchField name="isVerified" label={t("datatable:is_verified")} />}
        {isAdmin && (
          <SwitchField
            name="allowExternalPublishing"
            label={t("datatable:allow_external_publishing")}
          />
        )}
      </Box>
    </ToggleablePanel>
  );
}
