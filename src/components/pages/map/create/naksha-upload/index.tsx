import React from "react";

import LayerUpload from "./layer-upload";
import { LayerUploadProps, LayerUploadProvider } from "./use-layer-upload";

export const NakshaLayerUpload = (props: LayerUploadProps) => (
  <LayerUploadProvider {...props}>
    <LayerUpload />
  </LayerUploadProvider>
);
