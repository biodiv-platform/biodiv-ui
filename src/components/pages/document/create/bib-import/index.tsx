import { ArrowUpIcon } from "@chakra-ui/icons";
import { Button, VisuallyHidden } from "@chakra-ui/react";
import { axParseBib } from "@services/document.service";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function BibImportButton() {
  const { setValue } = useFormContext();
  const { t } = useTranslation();

  const handleOnBibUpload = async (e) => {
    const bibFile = e.target.files[0];
    if (bibFile.name.endsWith(".bib")) {
      const {
        success,
        data: { itemTypeId, ...bibFields }
      } = await axParseBib(bibFile);
      if (success) {
        setValue("itemTypeId", itemTypeId);
        setValue("bibFieldData", bibFields);
      }
    }
  };

  return (
    <Button
      cursor="pointer"
      as="label"
      size="sm"
      leftIcon={<ArrowUpIcon />}
      colorScheme="blue"
      borderRadius="3rem"
    >
      <VisuallyHidden
        type="file"
        as="input"
        id="bibtex-file"
        accept=".bib"
        onChange={handleOnBibUpload}
      />
      {t("document:import_bibtex")}
    </Button>
  );
}
