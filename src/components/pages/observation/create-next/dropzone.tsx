import { Box, useToast } from "@chakra-ui/react";
import { ACCEPTED_FILE_TYPES, DEFAULT_TOAST } from "@static/observation-create";
import { resizeMultiple } from "@utils/image";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useDropzone } from "react-dropzone";

import ObservationCreateNextForm from "./form";
import useObservationCreateNext from "./use-observation-create-next-hook";

export default function DraftDropzone() {
  const { t } = useTranslation();
  const toast = useToast();
  const toastIdRef = React.useRef<any>();
  const { draft } = useObservationCreateNext();

  const handleOnDrop = async (files) => {
    toastIdRef.current = toast({
      description: `${t("form:uploader.processing")}...`,
      ...DEFAULT_TOAST.LOADING
    });

    const resizedAssets = await resizeMultiple(files);
    draft.add(resizedAssets, true);

    if (toastIdRef.current && resizedAssets.length > 0) {
      toast.update(toastIdRef.current, {
        description: t("common:success"),
        ...DEFAULT_TOAST.SUCCESS
      });
      setTimeout(() => toast.close(toastIdRef.current), 1000);
    } else {
      toast.close(toastIdRef.current);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop: handleOnDrop,
    accept: ACCEPTED_FILE_TYPES
  });

  return (
    <Box
      {...getRootProps()}
      minH="calc(100vh - var(--heading-height))"
      bg={isDragActive ? "blue.100" : undefined}
      id="dropzone"
      cursor="inherit"
    >
      <input {...getInputProps()} />
      <ObservationCreateNextForm onBrowse={open} />
    </Box>
  );
}
