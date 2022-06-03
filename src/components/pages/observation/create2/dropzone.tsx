import { Box } from "@chakra-ui/react";
import { ACCEPTED_FILE_TYPES } from "@static/observation-create";
import { resizeMultiple } from "@utils/image";
import NProgress from "nprogress";
import React from "react";
import { useDropzone } from "react-dropzone";

import ObservationCreate2Form from "./form";
import useObservationCreate2 from "./use-observation-create2-hook";

export default function DraftDropzone() {
  const { draft } = useObservationCreate2();

  const handleOnDrop = async (files) => {
    NProgress.start();
    const resizedAssets = await resizeMultiple(files);
    draft.add(resizedAssets, true);
    NProgress.done();
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop: handleOnDrop,
    accept: ACCEPTED_FILE_TYPES
  });

  return (
    <Box
      {...getRootProps()}
      minH="calc(90vh - var(--heading-height))"
      bg={isDragActive ? "blue.100" : undefined}
      id="dropzone"
      cursor="inherit"
    >
      <input {...getInputProps()} />
      <ObservationCreate2Form onBrowse={open} />
    </Box>
  );
}
