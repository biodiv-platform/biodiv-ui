import { Box, FileUpload } from "@chakra-ui/react";
import { ACCEPTED_FILE_TYPES, DEFAULT_TOAST } from "@static/observation-create";
import { resizeMultiple } from "@utils/image";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useRef } from "react";

import { toaster } from "@/components/ui/toaster";

import ObservationCreateNextForm from "./form";
import useObservationCreateNext from "./use-observation-create-next-hook";

const ACCEPT_STRING =
  typeof ACCEPTED_FILE_TYPES === "object" && !Array.isArray(ACCEPTED_FILE_TYPES)
    ? Object.keys(ACCEPTED_FILE_TYPES).join(",")
    : Array.isArray(ACCEPTED_FILE_TYPES)
    ? ACCEPTED_FILE_TYPES.join(",")
    : ACCEPTED_FILE_TYPES || "image/*,video/*";

export default function DraftDropzone() {
  const { t } = useTranslation();
  const toastIdRef = useRef<any>();
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const { draft } = useObservationCreateNext();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const { acceptedFiles, rejectedFiles } = details;

      if (rejectedFiles && rejectedFiles.length > 0) {
        rejectedFiles.forEach((file) => {
          const resourceTypeFileFormat = "." + file.name.substring(file.name.lastIndexOf(".") + 1);
          notification(resourceTypeFileFormat + " format not supported");
        });
      }

      if (acceptedFiles.length === 0) return;

      toastIdRef.current = toaster.create({
        description: `${t("form:uploader.processing")}...`,
        ...DEFAULT_TOAST.LOADING
      });

      try {
        const resizedAssets = await resizeMultiple(acceptedFiles);
        draft.add(resizedAssets, true);

        if (toastIdRef.current && resizedAssets.length > 0) {
          toaster.update(toastIdRef.current, {
            description: t("common:success"),
            ...DEFAULT_TOAST.SUCCESS
          });
          setTimeout(() => {
            if (toastIdRef.current) toaster.dismiss(toastIdRef.current);
          }, 1000);
        } else {
          toaster.dismiss(toastIdRef.current);
        }
      } catch (error) {
        console.error("Draft compilation error:", error);
        toaster.dismiss(toastIdRef.current);
      }
    },
    [draft, t]
  );

  return (
    <FileUpload.Root
      accept={ACCEPT_STRING}
      onFileChange={handleFileChange}
      width="full"
      maxFiles={10}
    >
      <FileUpload.HiddenInput ref={fileUploadRef} />

      <FileUpload.Context>
        {(fileUpload) => (
          <FileUpload.Dropzone
            bg={fileUpload.dragging ? "blue.100" : "transparent"}
            border="none"
            p={0}
            minH="calc(100vh - var(--heading-height))"
            id="dropzone"
            cursor="inherit"
            width="full"
          >
            <Box width="full" height="full" onClick={(e) => e.stopPropagation()}>
              <ObservationCreateNextForm onBrowse={() => fileUpload.openFilePicker()} />
            </Box>
          </FileUpload.Dropzone>
        )}
      </FileUpload.Context>
    </FileUpload.Root>
  );
}
