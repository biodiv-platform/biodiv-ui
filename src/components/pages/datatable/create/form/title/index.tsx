import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import Select from "@components/form/select";
import RichTextareaField from "@components/form/rich-textarea";
import TextBoxField from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function PartyContributorsForm({ form, languages }) {
  const { t } = useTranslation();

  return (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>👥 {t("Title")}</BoxHeading>

      <TextBoxField name="title" label={t("DOCUMENT.TITLE")} form={form} isRequired={true} />

      <TextAreaField name="summary" form={form} label={t("GROUP.CUSTOM_FIELD.NOTES")} />

      <RichTextareaField name="description" label={t("GROUP.DESCRIPTION")} form={form} />

      <Select name="languageId" label={t("OBSERVATION.LANGUAGE")} options={languages} form={form} />
    </Box>
  );
}
