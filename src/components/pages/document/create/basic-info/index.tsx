import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { DatePickerNextField } from "@components/form/datepicker-next";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SelectInputField } from "@components/form/select";
import { TextBoxField } from "@components/form/text";
import { axGetDocumentBibFields } from "@services/document.service";
import { getBibFieldsMeta } from "@utils/document";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import BibImportButton from "../bib-import";
import { DocumentSocialPreviewField } from "./document-social-preview";
import TagsInput from "./tags-input";

interface BasicInfoProps {
  documentTypes;
  setBibField;
  canImport?: boolean;
  showTags?: boolean;
  licensesList;
}

export default function BasicInfo({
  documentTypes,
  setBibField,
  canImport,
  showTags = true,
  licensesList
}: BasicInfoProps) {
  const form = useFormContext();
  const { t } = useTranslation();
  const itemTypeIdWatch = form.watch("itemTypeId");

  const getBibOption = async () => {
    const { success, data: fields } = await axGetDocumentBibFields(itemTypeIdWatch);
    if (success) {
      setBibField(getBibFieldsMeta(fields));
    } else {
      notification(t("document:bib.schema.error"));
    }
  };

  useEffect(() => {
    if (itemTypeIdWatch) {
      getBibOption();
    }
  }, [itemTypeIdWatch]);

  return (
    <div>
      <Stack flexDirection={["column", "row"]} alignItems="top" mb={1}>
        <PageHeading as="h2" size="lg" mb={4} mr={4}>
          ℹ️ {t("document:basic_information")}
        </PageHeading>
        {canImport && <BibImportButton />}
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <Box gridColumn="1/4">
          <TextBoxField name="bibFieldData.title" label={t("form:title")} isRequired={true} />
        </Box>
        <SelectInputField
          name="itemTypeId"
          label={t("document:type")}
          options={documentTypes}
          isRequired={true}
          isControlled={true}
          shouldPortal={true}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <Box gridColumn="1/4">
          <RichTextareaField name="bibFieldData.abstract" label={t("document:description")} />
        </Box>

        <DocumentSocialPreviewField
          name="documentSocialPreview"
          label={t("document:social_preview")}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 0, md: 4 }}>
        <DatePickerNextField name="fromDate" label={t("document:publication_date")} />
        <SelectInputField
          name="licenseId"
          label={t("form:license")}
          options={licensesList}
          isRequired={true}
          isControlled={true}
          shouldPortal={true}
        />
      </SimpleGrid>
      {showTags && <TagsInput />}
    </div>
  );
}
