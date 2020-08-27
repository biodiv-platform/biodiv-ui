import { Box, SimpleGrid } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import TextBoxField from "@components/form/text";
import useTranslation from "@configs/i18n/useTranslation";
import { META_BIB_FIELDS } from "@static/document";
import React from "react";
import { UseFormMethods } from "react-hook-form";

interface MetadataProps {
  hForm: UseFormMethods<Record<string, any>>;
  bibFields;
}

export default function Metadata({ hForm, bibFields }: MetadataProps) {
  const { t } = useTranslation();

  return (
    <Box mb={6}>
      <PageHeading as="h2" size="lg">
        📖 {t("DOCUMENT.METADATA")}
      </PageHeading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={{ base: 0, md: 4 }}>
        {META_BIB_FIELDS.map((name) => (
          <TextBoxField
            key={name}
            name={`bibFieldData.${name}`}
            hidden={!Object.prototype.hasOwnProperty.call(bibFields, name)}
            isRequired={bibFields[name]}
            label={t(`DOCUMENT.BIB.${name.toUpperCase()}`)}
            form={hForm}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
