import { Box, CloseButton, FileUpload, Image } from "@chakra-ui/react";
import {
  Container,
  ITPageGalleryFieldProps
} from "@components/pages/page/common/form/gallery-field";
import { axUploadResource } from "@services/files.service";
import { resizeImage } from "@utils/image";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import { Field } from "@/components/ui/field";

const ACCEPT_STRING = "image/jpeg, image/png, image/jpg";

export const DocumentSocialPreviewField = ({
  helpText,
  label,
  name,
  mb = 4,
  hint,
  isRequired,
  hidden,
  ...props
}: ITPageGalleryFieldProps) => {
  const { t } = useTranslation();
  const { field } = useController({ name });

  const [isProcessing, setIsProcessing] = useState(false);
  const { formState } = useFormContext();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const file = details.acceptedFiles[0];

      if (details.rejectedFiles && details.rejectedFiles.length > 0) {
        notification("Format not supported. Please upload a valid image.");
        return;
      }

      if (!file) return;

      setIsProcessing(true);
      try {
        const [fileSm] = await resizeImage(file);
        const { success, data } = await axUploadResource(
          new File([fileSm], file.name),
          "documentSocialPreview"
        );

        if (success) {
          field.onChange(data);
        } else {
          notification(t("user:update_error"));
        }
      } catch (error) {
        console.error("Upload failed", error);
        notification(t("user:update_error"));
      } finally {
        setIsProcessing(false);
      }
    },
    [field, t]
  );

  const handleOnRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    field.onChange("");
  };

  {
    console.warn(
      "documentSocialPreview",
      getResourceThumbnail(RESOURCE_CTX.DOCUMENT_SOCIAL_PREVIEW, field.value, "?h=200")
    );
  }

  return (
    <Field
      invalid={!!formState.errors[name]}
      errorText={formState?.errors?.[name]?.message?.toString()}
      mb={mb}
      hidden={hidden}
      required={isRequired}
      {...props}
    >
      {label && <Field htmlFor={name} label={label} />}

      <Box id={name} width={"full"}>
        <Container
          style={{
            height: "124px",
            padding: "1rem",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {field.value ? (
            <Box position="relative">
              <Image
                src={getResourceThumbnail(
                  RESOURCE_CTX.DOCUMENT_SOCIAL_PREVIEW,
                  field.value,
                  "?h=200"
                )}
                alt={field.value}
                maxH="120px"
                objectFit="cover"
                borderRadius="md"
              />
              <CloseButton
                top={-2}
                right={-2}
                position="absolute"
                onClick={handleOnRemove}
                bg="white"
                size="sm"
                shadow="sm"
              />
            </Box>
          ) : isProcessing ? (
            <p>{t("common:loading")}</p>
          ) : (
            <FileUpload.Root
              accept={ACCEPT_STRING}
              onFileChange={handleFileChange}
              maxFiles={1}
              width="full"
              height="full"
            >
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone
                border="none"
                bg="transparent"
                p={0}
                width="full"
                height="full"
                minH="auto"
              >
                <FileUpload.DropzoneContent
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <p style={{ textAlign: "center", margin: 0 }}>
                    <span style={{ display: "block" }}>{t("form:uploader.label")}</span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.8em",
                        color: "var(--chakra-colors-gray-500)"
                      }}
                    >
                      {t("form:recommended_social_preview")}
                    </span>
                  </p>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
            </FileUpload.Root>
          )}
        </Container>
      </Box>

      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
};
