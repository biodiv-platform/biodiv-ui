import { Box, SimpleGrid } from "@chakra-ui/react";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SelectInputField } from "@components/form/select";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { BASIS_OF_DATA, BASIS_OF_RECORD } from "@static/datatable";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function PartyContributorsForm({ languages }) {
  const { t } = useTranslation();

  return (
    <ToggleablePanel icon="📃" title={t("datatable:title")}>
      <Box p={4} pb={0}>
        <TextBoxField name="title" label={t("form:title")} isRequired={true} />
        <TextAreaField name="summary" label={t("form:notes")} isRequired={true} />
        <RichTextareaField name="description" label={t("form:description.title")} />
        <SimpleGrid columns={{ md: 3 }} spacing={{ md: 4 }}>
          <SelectInputField name="languageId" label={t("form:language")} options={languages} />
          <SelectInputField
            name="basisOfData"
            label={t("datatable:basis_of_data")}
            options={BASIS_OF_DATA}
            isRequired={true}
            isControlled={true}
          />
          <SelectInputField
            name="basisOfRecord"
            label={t("datatable:basis_of_record")}
            options={BASIS_OF_RECORD}
            isRequired={true}
            isControlled={true}
          />
        </SimpleGrid>
      </Box>
    </ToggleablePanel>
  );
}
