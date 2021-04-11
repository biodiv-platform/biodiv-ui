import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import SelectAsyncInputField from "@components/form/select-async";
import TextBoxField from "@components/form/text";
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
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>👥 {t("Party Contributors")}</BoxHeading>
      <SelectAsyncInputField
        name="contributors"
        form={form}
        placeholder={t("GROUP.INVITE")}
        onQuery={onUserQuery}
        isRequired={true}
        label={t("Contributer")}
      />

      <TextBoxField name="attribution" label={t("Attribution")} form={form} />
    </Box>
  );
}
