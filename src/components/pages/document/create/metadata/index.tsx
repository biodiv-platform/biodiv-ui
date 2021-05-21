import { Box, SimpleGrid } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { TextBoxField } from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import { META_BIB_FIELDS } from "@static/document";
import React from "react";

interface MetadataProps {
  bibFields;
}

export default function Metadata({ bibFields }: MetadataProps) {
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
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
