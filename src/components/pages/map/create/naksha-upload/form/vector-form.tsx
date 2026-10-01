import { Box, Button, Flex, Heading, HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectMultipleInputField } from "@components/form/select-multiple";
import TagsField from "@components/form/simple-tag";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { LICENSES } from "naksha-components-react";
import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";

import { ACCESS, LAYER_TYPES } from "../data";
import useLayerUpload from "../use-layer-upload";
import DataPreview from "./data-preview";

export function VectorPreviewAndDescriptions() {
  const {
    shapeFiles: { dbf },
    resetFiles
  } = useLayerUpload();
  const { t } = useTranslation();

  return (
    <Box gridColumn={{ base: "1", md: "1/6" }} h="100%" overflowY="auto" pr={{ md: 2 }}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">🏁 {t("map:data_preview")}</Heading>
        {resetFiles && (
          <Button size="xs" variant="outline" onClick={resetFiles}>
            {t("map:change_files")}
          </Button>
        )}
      </Flex>
      <DataPreview hideHeading={true} />

      {dbf?.meta?.keys?.length > 0 && (
        <>
          <Heading size="md" mb={4}>
            📝 {t("map:column_description")}
          </Heading>

          {dbf.meta.keys.map((key) => (
            <HStack gap={4} key={key} maxW="32rem" mb={4}>
              <TextBoxField label={key} name={`layerColumnDescription.${key}`} />
            </HStack>
          ))}
        </>
      )}
    </Box>
  );
}

export function VectorFormFields() {
  const {
    shapeFiles: { dbf },
    canSubmit
  } = useLayerUpload();
  const { t } = useTranslation();

  const licenseOptions = useMemo(
    () => Object.keys(LICENSES).map((l) => ({ label: l, value: l })),
    []
  );

  const columnOptions = useMemo(
    () => dbf?.meta?.keys?.map((k) => ({ label: k, value: k })) || [],
    [dbf?.meta?.keys]
  );

  return (
    <Box mt={4}>
      <Heading size="md" mb={4}>
        🗺️ {t("map:layer_information")}
      </Heading>
      <Stack gap={4}>
        <TextBoxField name="layerName" label={t("map:name")} isRequired />
        <TextAreaField name="layerDescription" label={t("map:description")} isRequired />
        <SelectInputField
          name="layerType"
          options={LAYER_TYPES.filter((i) => i.value !== "RASTER")}
          label={t("map:layer_type")}
          shouldPortal={true}
          isRequired
        />

        <SelectInputField
          name="titleColumn"
          options={columnOptions}
          label={t("map:title_column")}
          shouldPortal={true}
          isRequired
        />

        <SelectMultipleInputField
          name="summaryColumns"
          label={t("map:summary_columns")}
          options={columnOptions}
          isRequired
        />

        <SelectInputField
          name="colorBy"
          options={columnOptions}
          label={t("map:color_by")}
          shouldPortal={true}
          isRequired
        />

        <TextBoxField name="createdBy" label={t("map:created_by")} isRequired />
        <TextBoxField name="attribution" label={t("map:attribution")} isRequired />
        <TextBoxField name="url" label={t("map:url")} />
        <TextBoxField name="pdfLink" label={t("map:pdf_link")} />
        <TagsField name="tags" label={t("map:tags")} hint="Press enter to add tags" required />
        <SelectInputField
          name="license"
          options={licenseOptions}
          label={t("map:license")}
          shouldPortal={true}
          isRequired
        />
        <TextBoxField name="createdDate" label={t("map:created_date")} type="date" isRequired />
        <SelectInputField
          name="downloadAccess"
          options={ACCESS}
          label={t("map:download_access")}
          shouldPortal={true}
          isRequired
        />
        <Button disabled={!canSubmit} colorPalette="blue" type="submit">
          {canSubmit ? t("map:create") : t("map:uploading_files")}
        </Button>
      </Stack>
    </Box>
  );
}

export default function VectorUploadForm() {
  return (
    <SimpleGrid columns={{ base: 1, md: 7 }} gap={4} h="100%">
      <VectorPreviewAndDescriptions />
      <Box gridColumn={{ base: "1", md: "6/8" }} h="100%" overflowY="auto" pl={{ md: 2 }}>
        <VectorFormFields />
      </Box>
    </SimpleGrid>
  );
}
