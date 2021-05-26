import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { DatePickerField } from "@components/form/datepicker";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SelectInputField } from "@components/form/select";
import { TextBoxField } from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import { axGetDocumentBibFields } from "@services/document.service";
import { getBibFieldsMeta } from "@utils/document";
import notification from "@utils/notification";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import BibImportButton from "../bib-import";

interface BasicInfoProps {
  documentTypes;
  setBibField;
  canImport?: boolean;
  licensesList;
}

export default function BasicInfo({
  documentTypes,
  setBibField,
  canImport,
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
      notification(t("DOCUMENT.BIB.SCHEMA.ERROR"));
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
          ℹ️ {t("DOCUMENT.BASIC_INFORMATION")}
        </PageHeading>
        {canImport && <BibImportButton />}
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <Box gridColumn="1/4">
          <TextBoxField name="bibFieldData.title" label={t("DOCUMENT.TITLE")} isRequired={true} />
        </Box>
        <SelectInputField
          name="itemTypeId"
          label={t("DOCUMENT.TYPE")}
          options={documentTypes}
          isRequired={true}
          isControlled={true}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 0, md: 4 }}>
        <div>
          <RichTextareaField name="bibFieldData.abstract" label={t("DOCUMENT.DESCRIPTION")} />
        </div>
        <div>
          <TextBoxField name="contribution" label={t("DOCUMENT.CONTRIBUTION")} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 0, md: 4 }}>
            <DatePickerField name="fromDate" label={t("DOCUMENT.PUBLICATION_DATE")} />
            <SelectInputField
              name="licenseId"
              label={t("DOCUMENT.LICENSE")}
              options={licensesList}
              isRequired={true}
              isControlled={true}
            />
          </SimpleGrid>
        </div>
      </SimpleGrid>
    </div>
  );
}
