import { Box, Button, Heading, HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectMultipleInputField } from "@components/form/select-multiple";
import TagsField from "@components/form/simple-tag";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { LICENSES } from "naksha-components-react";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import { ACCESS, LAYER_TYPES } from "../data";
import useLayerUpload from "../use-layer-upload";
import DataPreview from "./data-preview";

export default function VectorUploadForm() {
  const {
    shapeFiles: { dbf }
  } = useLayerUpload();
  const { t } = useTranslation();

  const licenseOptions = useMemo(
    () => Object.keys(LICENSES).map((l) => ({ label: l, value: l })),
    []
  );

  const columnOptions = useMemo(() => dbf?.meta?.keys?.map((k) => ({ label: k, value: k })), []);

  return (
    <SimpleGrid columns={{ base: 1, md: 7 }} spacing={4} h="100%">
      <Box gridColumn="1/6" h="100%">
        <DataPreview />

        <Heading size="md" mb={4}>
          📝 {t("map:column_description")}
        </Heading>

        {dbf.meta.keys.map((key) => (
          <HStack spacing={4} key={key} maxW="32rem" mb={4}>
            <TextBoxField label={key} name={`layerColumnDescription.${key}`} />
          </HStack>
        ))}
      </Box>
      <Box gridColumn="6/8" h="100%">
        <Heading size="md" mb={4}>
          🗺️ {t("map:layer_information")}
        </Heading>
        <Stack spacing={4}>
          <TextBoxField name="layerName" label={t("map:name")} />
          <TextAreaField name="layerDescription" label={t("map:description")} />
          <SelectInputField
            name="layerType"
            options={LAYER_TYPES.filter(i => i.value !== 'RASTER')}
            label={t("map:layer_type")}
            shouldPortal={true}
          />

          <SelectInputField
            name="titleColumn"
            options={columnOptions}
            label={t("map:title_column")}
            shouldPortal={true}
          />

          <SelectMultipleInputField
            name="summaryColumns"
            label={t("map:summary_columns")}
            options={columnOptions}
          />

          <SelectInputField
            name="colorBy"
            options={columnOptions}
            label={t("map:color_by")}
            shouldPortal={true}
          />

          <TextBoxField name="createdBy" label={t("map:created_by")} />
          <TextBoxField name="attribution" label={t("map:attribution")} />
          <TextBoxField name="url" label={t("map:url")} />
          <TextBoxField name="pdfLink" label={t("map:pdf_link")} />
          <TagsField name="tags" label={t("map:tags")} hint="Press enter to add tags" />
          <SelectInputField
            name="license"
            options={licenseOptions}
            label={t("map:license")}
            shouldPortal={true}
          />
          <TextBoxField name="createdDate" label={t("map:created_date")} type="date" />
          <SelectInputField
            name="downloadAccess"
            options={ACCESS}
            label={t("map:download_access")}
            shouldPortal={true}
          />
          <Button colorScheme="blue" type="submit">
            {t("map:create")}
          </Button>
        </Stack>
      </Box>
    </SimpleGrid>
  );
}
