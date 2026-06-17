import { Box, CloseButton, FileUpload, Image } from "@chakra-ui/react";
import { axUploadResource } from "@services/files.service";
import { resizeForFavicon, resizeImage } from "@utils/image";
import { getSiteResourceRAW, RESOURCE_CTX } from "@utils/media";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

import { Field } from "@/components/ui/field";

import { Container, ITPageGalleryFieldProps } from "../../page/common/form/gallery-field";

const ACCEPT_STRING = "image/png";

export const LogoField = ({
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
  const [imageVersion, setImageVersion] = useState(Date.now());
  const { formState } = useFormContext();

  const clearImageCache = async () => {
    try {
      const response = await fetch("/api/memory-cache/clear");
      if (!response.ok) {
        console.error("Failed to clear image cache");
      }
    } catch (error) {
      console.error("Image cache clear request failed:", error);
    }
  };

  const safeClearCache = () => {
    clearImageCache().catch((err) => {
      console.error("Cache clear failed:", err);
    });
  };

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const file = details.acceptedFiles[0];

      if (details.rejectedFiles && details.rejectedFiles.length > 0) {
        notification("Invalid file format. Only .png images are accepted here.");
        return;
      }

      if (!file) return;

      setIsProcessing(true);

      try {
        const [fileSm] =
          name === "favIcon" ? await resizeForFavicon(file) : await resizeImage(file);

        const { success, data } = await axUploadResource(
          new File([fileSm], name + ".png"),
          "site",
          name
        );

        if (success) {
          field.onChange(data);
          setImageVersion(Date.now());
          safeClearCache();
        } else {
          notification(t("user:update_error"));
        }
      } catch (error) {
        console.error(error);
        notification(t("user:update_error"));
      } finally {
        setIsProcessing(false);
      }
    },
    [field, name, t]
  );

  const handleOnRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    field.onChange("");
    setImageVersion(Date.now());
    safeClearCache();
  };

  const getImageUrl = () => {
    if (!field.value) return "";
    const baseUrl = getSiteResourceRAW(RESOURCE_CTX.SITE, field.value);
    return `${baseUrl}?v=${imageVersion}`;
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
            height: "200px",
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
                src={getImageUrl()}
                alt={field.value}
                maxH="120px"
                objectFit="cover"
                borderRadius="md"
                key={imageVersion}
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
                  <p>{t("form:uploader.label")}</p>
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
