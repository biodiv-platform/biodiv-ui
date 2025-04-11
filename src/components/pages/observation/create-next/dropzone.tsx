import { Box } from "@chakra-ui/react";
import { ACCEPTED_FILE_TYPES, DEFAULT_TOAST } from "@static/observation-create";
import { resizeMultiple } from "@utils/image";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useDropzone } from "react-dropzone";

import { toaster } from "@/components/ui/toaster";

import ObservationCreateNextForm from "./form";
import useObservationCreateNext from "./use-observation-create-next-hook";

export default function DraftDropzone() {
  const { t } = useTranslation();
  const toastIdRef = React.useRef<any>();
  const { draft } = useObservationCreateNext();

  const handleOnDrop = async (files) => {
    toastIdRef.current = toaster.create({
      description: `${t("form:uploader.processing")}...`,
      ...DEFAULT_TOAST.LOADING
    });

    const resizedAssets = await resizeMultiple(files);
    draft.add(resizedAssets, true);

    if (toastIdRef.current && resizedAssets.length > 0) {
      toaster.update(toastIdRef.current, {
        description: t("common:success"),
        ...DEFAULT_TOAST.SUCCESS
      });
      setTimeout(() => toaster.dismiss(toastIdRef.current), 1000);
    } else {
      toaster.dismiss(toastIdRef.current);
    }
  };

  const handleOnRejected = (files) => {
    files.map((file) => {
      const resourceTypeFileFormat =
        "." + file.file.name.substring(file.file.name.lastIndexOf(".") + 1);
      notification(resourceTypeFileFormat + " format not supported");
    });
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop: handleOnDrop,
    accept: ACCEPTED_FILE_TYPES,
    onDropRejected: handleOnRejected
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
