import { OBSERVATION_BULK_EDIT } from "@static/events";
import React, { useState } from "react";
import { useListener } from "react-gbus";

import { prepareObservationData } from "../common";
import BulkEditorModal from "./modal";

export default function BulkEditor() {
  const [initialValueProps, setInitialValueProps] = useState<any>();

  useListener(
    (data) =>
      setInitialValueProps({
        initialValue: prepareObservationData(data.data),
        applyIndex: data.applyIndex
      }),
    [OBSERVATION_BULK_EDIT]
  );

  const handleOnClose = () => setInitialValueProps(undefined);

  return initialValueProps ? (
    <BulkEditorModal {...initialValueProps} onClose={handleOnClose} />
  ) : null;
}
