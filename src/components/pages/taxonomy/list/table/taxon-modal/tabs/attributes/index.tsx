import { Box, Button, useDisclosure } from "@chakra-ui/react";
import EditIcon from "@icons/edit";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { TaxonAttributesForm } from "./attributes-form";
import { TaxonAttributesTable } from "./attributes-table";

export function TaxonAttributesTab() {
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box mt={4}>
      <Button
        mb={4}
        size="sm"
        colorScheme="blue"
        variant="outline"
        leftIcon={<EditIcon />}
        onClick={onToggle}
      >
        {t("common:edit")}
      </Button>
      <div>{isOpen ? <TaxonAttributesForm /> : <TaxonAttributesTable />}</div>
    </Box>
  );
}
