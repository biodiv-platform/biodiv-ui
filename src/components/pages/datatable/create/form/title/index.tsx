import { Box, SimpleGrid } from "@chakra-ui/react";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SelectInputField } from "@components/form/select";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import useTranslation from "@hooks/use-translation";
import { BASIS_OF_DATA, BASIS_OF_RECORD } from "@static/datatable";
import React from "react";

export default function PartyContributorsForm({ languages }) {
  const { t } = useTranslation();

  return (
    <ToggleablePanel icon="📃" title={t("DATATABLE.TITLE")}>
      <Box p={4} pb={0}>
        <TextBoxField name="title" label={t("DOCUMENT.TITLE")} isRequired={true} />
        <TextAreaField name="summary" label={t("GROUP.CUSTOM_FIELD.NOTES")} isRequired={true} />
        <RichTextareaField name="description" label={t("GROUP.DESCRIPTION")} />
        <SimpleGrid columns={{ md: 3 }} spacing={{ md: 4 }}>
          <SelectInputField
            name="languageId"
            label={t("OBSERVATION.LANGUAGE")}
            options={languages}
          />
          <SelectInputField
            name="basisOfData"
            label={t("DATATABLE.BASIS_OF_DATA")}
            options={BASIS_OF_DATA}
            isRequired={true}
            isControlled={true}
          />
          <SelectInputField
            name="basisOfRecord"
            label={t("DATATABLE.BASIS_OF_RECORD")}
            options={BASIS_OF_RECORD}
            isRequired={true}
            isControlled={true}
          />
        </SimpleGrid>
      </Box>
    </ToggleablePanel>
  );
}
