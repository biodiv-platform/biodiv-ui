import { Button, VisuallyHidden } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axParseBib } from "@services/document.service";
import React from "react";

export default function BibImportButton({ hForm }) {
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
    <Button
      cursor="pointer"
      as="label"
      size="sm"
      leftIcon="arrow-up"
      variantColor="blue"
      borderRadius="3rem"
    >
      <VisuallyHidden
        // @ts-ignore
        type="file"
        as="input"
        id="bibtex-file"
        accept=".bib"
        onChange={handleOnBibUpload}
      />
      {t("DOCUMENT.IMPORT_BIBTEX")}
    </Button>
  );
}
