import React from "react";

import LayerUploadDropzone from "./dropzone";
import LayerUploadForm from "./form";
import FormUploadMessage from "./message";
import useLayerUpload from "./use-layer-upload";

export default function LayerUpload() {
  const { screen } = useLayerUpload();

  switch (screen) {
    case 0:
      return <LayerUploadDropzone />;

    case 1:
      return <LayerUploadForm />;

    case 2:
      return <FormUploadMessage />;

    default:
      return null;
  }
}
