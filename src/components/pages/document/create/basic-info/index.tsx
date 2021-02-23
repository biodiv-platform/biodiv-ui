import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import DatePickerField from "@components/form/datepicker";
import RichTextareaField from "@components/form/rich-textarea";
import SelectInputField from "@components/form/select";
import TextBoxField from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import { axGetDocumentBibFields } from "@services/document.service";
import { LICENSES_ARRAY } from "@static/licenses";
import { getBibFieldsMeta } from "@utils/document";
import notification from "@utils/notification";
import React, { useEffect } from "react";
import { UseFormMethods } from "react-hook-form";

import BibImportButton from "../bib-import";

interface BasicInfoProps {
  hForm: UseFormMethods<Record<string, any>>;
  documentTypes;
  setBibField;
  canImport?: boolean;
}

export default function BasicInfo({
  hForm,
  documentTypes,
  setBibField,
  canImport
}: BasicInfoProps) {
  const { t } = useTranslation();
  const itemTypeIdWatch = hForm.watch("itemTypeId");

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
        {canImport && <BibImportButton hForm={hForm} />}
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <Box gridColumn="1/4">
          <TextBoxField
            name="bibFieldData.title"
            label={t("DOCUMENT.TITLE")}
            form={hForm}
            isRequired={true}
          />
        </Box>
        <SelectInputField
          name="itemTypeId"
          label={t("DOCUMENT.TYPE")}
          options={documentTypes}
          form={hForm}
          isRequired={true}
          isControlled={true}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 0, md: 4 }}>
        <div>
          <RichTextareaField
            name="bibFieldData.abstract"
            label={t("DOCUMENT.DESCRIPTION")}
            form={hForm}
          />
        </div>
        <div>
          <TextBoxField name="contribution" label={t("DOCUMENT.CONTRIBUTION")} form={hForm} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 0, md: 4 }}>
            <DatePickerField
              name="fromDate"
              label={t("DOCUMENT.PUBLICATION_DATE")}
              form={hForm}
              isRequired={true}
            />
            <SelectInputField
              name="licenseId"
              label={t("DOCUMENT.LICENSE")}
              form={hForm}
              options={LICENSES_ARRAY}
              isRequired={true}
              isControlled={true}
            />
          </SimpleGrid>
        </div>
      </SimpleGrid>
    </div>
  );
}
