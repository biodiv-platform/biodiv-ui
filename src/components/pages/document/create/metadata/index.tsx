import { Box, Button, SimpleGrid, Stack, VisuallyHidden } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import TextBoxField from "@components/form/text";
import useTranslation from "@configs/i18n/useTranslation";
import { axParseBib } from "@services/document.service";
import { META_BIB_FIELDS } from "@static/document";
import React from "react";
import { UseFormMethods } from "react-hook-form";

const VH: any = VisuallyHidden;

interface MetadataProps {
  hForm: UseFormMethods<Record<string, any>>;
  bibFields;
}

export default function Metadata({ hForm, bibFields }: MetadataProps) {
  const { t } = useTranslation();

  const handleOnBibUpload = async (e) => {
    const bibFile = e.target.files[0];
    if (bibFile.name.endsWith(".bib")) {
      const {
        success,
        data: { itemTypeId, ...bibFields }
      } = await axParseBib(bibFile);
      if (success) {
        hForm.setValue("itemTypeId", itemTypeId);
        hForm.setValue("bibFieldData", bibFields);
      }
    }
  };

  return (
    <Box mb={6}>
      <Stack flexDirection={["column", "row"]} alignItems="top" mb={1}>
        <PageHeading as="h2" size="lg" mr={4}>
          📖 {t("DOCUMENT.METADATA")}
        </PageHeading>
        <Button
          cursor="pointer"
          as="label"
          size="sm"
          leftIcon="arrow-up"
          variantColor="blue"
          borderRadius="3rem"
        >
          <VH as="input" type="file" id="bibtex-file" accept=".bib" onChange={handleOnBibUpload} />
          {t("DOCUMENT.IMPORT_BIBTEX")}
        </Button>
      </Stack>

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
