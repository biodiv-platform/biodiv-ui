import { Box } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import { TextBoxField } from "@components/form/text";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { axUserSearch } from "@services/auth.service";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function PartyContributorsForm() {
  const { t } = useTranslation();

  const onUserQuery = async (q) => {
    const { data } = await axUserSearch(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  return (
    <ToggleablePanel icon="⚛️" title={t("datatable:party")}>
      <Box p={4} pb={0}>
        <SelectAsyncInputField
          name="contributors"
          placeholder={t("group:invite")}
          onQuery={onUserQuery}
          isRequired={true}
          label={t("datatable:contributor")}
        />
        <TextBoxField name="attribution" label={t("datatable:attribution")} />
      </Box>
    </ToggleablePanel>
  );
}
