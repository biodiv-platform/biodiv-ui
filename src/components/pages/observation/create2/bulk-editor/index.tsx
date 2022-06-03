import { OBSERVATION_BULK_EDIT } from "@static/events";
import React, { useState } from "react";
import { useListener } from "react-gbus";

import { prepareObservationData } from "../common";
import BulkEditorModal from "./modal";

export default function BulkEditor() {
  const [initialValue, setInitialValue] = useState<any>();

  useListener(
    (initialEditObject) => setInitialValue(prepareObservationData(initialEditObject)),
    [OBSERVATION_BULK_EDIT]
  );

  const handleOnClose = () => setInitialValue(undefined);

  return initialValue ? (
    <BulkEditorModal initialValue={initialValue} onClose={handleOnClose} />
  ) : null;
}
