import { Button, Heading, Stack } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import TagsField from "@components/form/simple-tag";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { LICENSES } from "naksha-components-react";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import { ACCESS, LAYER_TYPES } from "../data";
import useLayerUpload from "../use-layer-upload";

export default function RasterUploadForm() {
  const { t } = useTranslation();

  const { canContinue } = useLayerUpload();

  const licenseOptions = useMemo(
    () => Object.keys(LICENSES).map((l) => ({ label: l, value: l })),
    []
  );
  return (
    <Stack>
      <Heading size="md" mb={4}>
        🗺️ {t("map:layer_information")}
      </Heading>
      <TextBoxField name="layerName" label={t("map:name")} />

      <SelectInputField
        name="layerType"
        options={LAYER_TYPES.filter((i) => i.value === "RASTER")}
        label={t("map:layer_type")}
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
      <TextAreaField name="layerDescription" label={t("map:description")} />

      <Button disabled={!canContinue} colorScheme="blue" type="submit">
        {t("map:create")}
      </Button>
    </Stack>
  );
}
