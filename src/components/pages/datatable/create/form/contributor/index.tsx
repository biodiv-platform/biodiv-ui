import { Box } from "@chakra-ui/react";
import SelectAsyncInputField from "@components/form/select-async";
import TextBoxField from "@components/form/text";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import useTranslation from "@hooks/use-translation";
import { axUserSearch } from "@services/auth.service";
import React from "react";

export default function PartyContributorsForm({ form }) {
  const { t } = useTranslation();

  const onUserQuery = async (q) => {
    const { data } = await axUserSearch(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  return (
    <ToggleablePanel icon="⚛️" title={t("DATATABLE.PARTY")}>
      <Box p={4} pb={0}>
        <SelectAsyncInputField
          name="contributors"
          form={form}
          placeholder={t("GROUP.INVITE")}
          onQuery={onUserQuery}
          isRequired={true}
          label={t("DATATABLE.CONTRIBUTOR")}
        />
        <TextBoxField name="attribution" label={t("DATATABLE.ATTRIBUTION")} form={form} />
      </Box>
    </ToggleablePanel>
  );
}
