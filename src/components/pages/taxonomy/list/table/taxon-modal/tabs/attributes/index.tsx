import { Box, Button, useDisclosure } from "@chakra-ui/react";
import EditIcon from "@icons/edit";
import { Role } from "@interfaces/custom";
import { hasAccess, waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { TaxonAttributesForm } from "./attributes-form";
import { TaxonAttributesTable } from "./attributes-table";

export function TaxonAttributesTab() {
  const { t } = useTranslation();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleOnEdit = async () => {
    await waitForAuth();
    onToggle();
  };

  return (
    <Box mt={4}>
      <Button
        mb={4}
        size="sm"
        colorPalette="blue"
        variant="outline"
        hidden={!hasAccess([Role.Admin])}
        leftIcon={<EditIcon />}
        onClick={handleOnEdit}
      >
        {t("common:edit")}
      </Button>
      <div>{isOpen ? <TaxonAttributesForm onClose={onClose} /> : <TaxonAttributesTable />}</div>
    </Box>
  );
}
