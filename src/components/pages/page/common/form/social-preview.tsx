import { Box, CloseButton, FileUpload, Image } from "@chakra-ui/react";
import { axUploadResource } from "@services/files.service";
import { resizeImage } from "@utils/image";
import { getResourceRAW, RESOURCE_CTX } from "@utils/media";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import { Field } from "@/components/ui/field";

import { Container, ITPageGalleryFieldProps } from "./gallery-field";

const ACCEPT_STRING = "image/jpeg, image/png, image/jpg";

export const SocialPreviewField = ({
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
        notification("Format not supported. Please upload a valid image file.");
        return;
      }

      if (!file) return;

      setIsProcessing(true);
      try {
        const [fileSm] = await resizeImage(file);
        const { success, data } = await axUploadResource(new File([fileSm], file.name), "pages");

        if (success) {
          field.onChange(data);
        } else {
          notification(t("user:update_error"));
        }
      } catch (error) {
        console.error("Social preview upload failed:", error);
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
                src={getResourceRAW(RESOURCE_CTX.PAGES, field.value)}
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
                  justifyContent="center"
                  height="full"
                >
                  <p style={{ margin: 0 }}>{t("form:uploader.label")}</p>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
            </FileUpload.Root>
          )}
        </Container>
      </Box>

      {hint && <Field color="gray.600" helperText={hint}></Field>}
    </Field>
  );
};
