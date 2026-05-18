import { Separator } from "@chakra-ui/react";
import React, { useState } from "react";

import Loading from "@/components/pages/common/loading";

import UpdateNameForm from "./forms/update-name-form";
import UpdatePositionForm from "./forms/update-position-form";
import UpdateTaxonForm from "./forms/update-taxon-form";

export function TaxonAttributesForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  return (
    loading?
    <Loading/>
    :
    <div>
      <UpdateNameForm onDone={onClose} setLoading={setLoading}/>
      <Separator my={4} />
      <UpdatePositionForm onDone={onClose} setLoading={setLoading}/>
      <Separator my={4} />
      <UpdateTaxonForm onDone={onClose} setLoading={setLoading}/>
    </div>
  );
}
