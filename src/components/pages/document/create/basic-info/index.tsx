import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import DatePickerField from "@components/form/datepicker";
import RichTextareaField from "@components/form/rich-textarea";
import SelectInputField from "@components/form/select";
import SelectAsyncInputField from "@components/form/select-async";
import TextBoxField from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import { axGetDocumentBibFields, axQueryDocumentTagsByText } from "@services/document.service";
import { DEFAULT_BIB_FIELDS_SCHEMA } from "@static/document";
import { LICENSES_ARRAY } from "@static/licenses";
import notification from "@utils/notification";
import React, { useEffect } from "react";
import { UseFormMethods } from "react-hook-form";
import * as Yup from "yup";

import BibImportButton from "../bib-import";

interface BasicInfoProps {
  hForm: UseFormMethods<Record<string, any>>;
  documentTypes;
  setBibField;
}

const onTagsQuery = async (q) => {
  const { data } = await axQueryDocumentTagsByText(q);
  return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
};

export default function BasicInfo({ hForm, documentTypes, setBibField }: BasicInfoProps) {
  const { t } = useTranslation();
  const itemTypeIdWatch = hForm.watch("itemTypeId");

  const getBibFieldsMeta = (fields) => {
    return {
      schema: Object.entries(fields).reduce(
        (schema, [key, value]) => (value ? { ...schema, [key]: Yup.string().required() } : schema),
        DEFAULT_BIB_FIELDS_SCHEMA
      ),
      fields
    };
  };

  const getBibOption = async () => {
    const {
      success,
      data: { "item type": _1, file, ...fields }
    } = await axGetDocumentBibFields(itemTypeIdWatch);
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
          ℹ️ Basic Information
        </PageHeading>
        <BibImportButton hForm={hForm} />
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
          <TextBoxField
            name="contribution"
            label={t("DOCUMENT.CONTRIBUTION")}
            form={hForm}
            isRequired={true}
          />
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
      <SelectAsyncInputField
        name="tags"
        label={t("DOCUMENT.TAGS")}
        hint={t("OBSERVATION.TAGS_HINT")}
        form={hForm}
        multiple={true}
        onQuery={onTagsQuery}
      />
    </div>
  );
}
