import { Box, SimpleGrid } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import RichTextareaField from "@components/form/rich-textarea";
import SelectInputField from "@components/form/select";
import TextBoxField from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@hooks/use-translation";
import { BASIS_OF_DATA, BASIS_OF_RECORD } from "@static/datatable";
import React from "react";

export default function PartyContributorsForm({ form, languages }) {
  const { t } = useTranslation();

  return (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>👥 {t("DATATABLE.TITLE")}</BoxHeading>

      <TextBoxField name="title" label={t("DOCUMENT.TITLE")} form={form} isRequired={true} />

      <TextAreaField
        name="summary"
        form={form}
        label={t("GROUP.CUSTOM_FIELD.NOTES")}
        isRequired={true}
      />

      <RichTextareaField name="description" label={t("GROUP.DESCRIPTION")} form={form} />

      <SimpleGrid columns={[1, 1, 3, 3]} spacing={2}>
        <SelectInputField
          name="languageId"
          label={t("OBSERVATION.LANGUAGE")}
          options={languages}
          form={form}
        />

        <SelectInputField
          name="basisOfData"
          label={t("DATATABLE.BASIS_OF_DATA")}
          form={form}
          options={BASIS_OF_DATA}
          isRequired={true}
          isControlled={true}
        />

        <SelectInputField
          name="basisOfRecord"
          label={t("DATATABLE.BASIS_OF_RECORD")}
          form={form}
          options={BASIS_OF_RECORD}
          isRequired={true}
          isControlled={true}
        />
      </SimpleGrid>
    </Box>
  );
}
