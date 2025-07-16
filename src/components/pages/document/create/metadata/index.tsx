import { Box, SimpleGrid } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { TextBoxField } from "@components/form/text";
import { META_BIB_FIELDS } from "@static/document";
import useTranslation from "next-translate/useTranslation";
import React from "react";

interface MetadataProps {
  bibFields;
}

export default function Metadata({ bibFields }: MetadataProps) {
  const { t } = useTranslation();

  return (
    <Box mb={6}>
      <PageHeading as="h2">📖 {t("document:metadata")}</PageHeading>

      <SimpleGrid columns={{ base: 1, md: 2 }} gapX={{ base: 0, md: 4 }}>
        {META_BIB_FIELDS.map((name) => (
          <TextBoxField
            key={name}
            name={`bibFieldData.${name}`}
            hidden={!Object.prototype.hasOwnProperty.call(bibFields, name)}
            isRequired={bibFields[name]}
            label={t(`document:bib.${name.toLowerCase()}`)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
