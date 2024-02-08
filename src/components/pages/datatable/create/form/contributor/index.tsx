import { Box } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import { TextBoxField } from "@components/form/text";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { axEsUserAutoComplete } from "@services/auth.service";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function PartyContributorsForm() {
  const { t } = useTranslation();

  const onUserQuery = async (q) => {
    const { data } = await axEsUserAutoComplete(q);
    return data.map((tag) => ({
      label: `${tag.name} (${tag.id})`,
      value: tag.id,
      version: tag.version
    }));
  };

  return (
    <ToggleablePanel icon="⚛️" title={t("datatable:party")}>
      <Box p={4} pb={0}>
        <SelectAsyncInputField
          name="contributors"
          placeholder={t("group:invite")}
          onQuery={onUserQuery}
          resetOnSubmit={false}
          isRequired={true}
          isRaw={true}
          isCreatable={false}
          label={t("datatable:contributor")}
        />
        <TextBoxField name="attribution" maxLength={1000} label={t("datatable:attribution")} />
      </Box>
    </ToggleablePanel>
  );
}
