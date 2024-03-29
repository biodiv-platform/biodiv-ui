import { Divider } from "@chakra-ui/react";
import React from "react";

import UpdateNameForm from "./forms/update-name-form";
import UpdatePositionForm from "./forms/update-position-form";
import UpdateTaxonForm from "./forms/update-taxon-form";

export function TaxonAttributesForm({ onClose }) {
  return (
    <div>
      <UpdateNameForm onDone={onClose} />
      <Divider my={4} />
      <UpdateTaxonForm onDone={onClose} />
      <Divider my={4} />
      <UpdatePositionForm onDone={onClose} />
    </div>
  );
}
