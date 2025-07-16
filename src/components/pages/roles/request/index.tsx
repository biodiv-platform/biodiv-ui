import { Button, useDisclosure } from "@chakra-ui/react";
import TaxonBrowserComponent from "@components/pages/observation/list/filters/taxon-browser/taxon-browser";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import { TaxonPermissionRequestModal } from "./request-modal";

export default function RolesRequestComponent({ isAdmin }) {
  const [selectedTaxon, setSelectedTaxon] = useState();

  const { open, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <TaxonBrowserComponent
        initialTaxon={selectedTaxon}
        onTaxonChange={(_, data) => setSelectedTaxon(data)}
      />
      <Button my={4} colorPalette="blue" onClick={onOpen} disabled={!selectedTaxon}>
        {isAdmin ? t("taxon:grant.title") : t("taxon:request.title")}
      </Button>
      <TaxonPermissionRequestModal
        isOpen={open}
        onClose={onClose}
        taxon={selectedTaxon}
        isAdmin={isAdmin}
      />
    </div>
  );
}
