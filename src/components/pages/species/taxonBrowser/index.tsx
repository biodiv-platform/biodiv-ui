import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import TaxonBrowserComponent from "@components/pages/observation/list/filters/taxon-browser/taxon-browser";
import useTranslation from "@hooks/use-translation";
import React, { useState } from "react";

import { TaxonPermissionRequestModal } from "./request-modal";

export default function SpeciesTaxonBrowserComponent() {
  const [selectedTaxon, setSelectedTaxon] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <TaxonBrowserComponent
        initialTaxon={selectedTaxon}
        onTaxonChange={(_, data) => setSelectedTaxon(data)}
      />
      <Button my={4} colorScheme="blue" onClick={onOpen} disabled={!selectedTaxon}>
        {t("TAXON.REQUEST.TITLE")}
      </Button>
      <TaxonPermissionRequestModal isOpen={isOpen} onClose={onClose} taxon={selectedTaxon} />
    </div>
  );
}
