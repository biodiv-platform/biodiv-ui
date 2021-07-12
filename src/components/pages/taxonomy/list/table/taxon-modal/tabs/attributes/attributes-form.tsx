import { Divider } from "@chakra-ui/react";
import React from "react";

import UpdateNameForm from "./forms/update-name-form";
import UpdatePositionForm from "./forms/update-position-form";
import UpdateTaxonForm from "./forms/update-taxon-form";

export function TaxonAttributesForm() {
  return (
    <div>
      <UpdateNameForm />
      <Divider my={4} />
      <UpdateTaxonForm />
      <Divider my={4} />
      <UpdatePositionForm />
    </div>
  );
}
