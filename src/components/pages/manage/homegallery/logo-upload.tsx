import { Box, CloseButton, Image } from "@chakra-ui/react";
import { axUploadResource } from "@services/files.service";
import { resizeForFavicon, resizeImage } from "@utils/image";
import { getSiteResourceRAW, RESOURCE_CTX } from "@utils/media";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";

import { Field } from "@/components/ui/field";

import { Container, ITPageGalleryFieldProps } from "../../page/common/form/gallery-field";

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

  const onDrop = async ([file]) => {
    if (!file) return;

    setIsProcessing(true);

    try {
      const [fileSm] = name === "favIcon" ? await resizeForFavicon(file) : await resizeImage(file);

      const { success, data } = await axUploadResource(
        new File([fileSm], name + ".png"),
        "site",
        name
      );

      if (success) {
        field.onChange(data);

        await clearImageCache();

        setImageVersion(Date.now());
      } else {
        notification(t("user:update_error"));
      }
    } catch (error) {
      console.error(error);
      notification(t("user:update_error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "image/png": [".png"]
    },
    multiple: false,
    onDrop
  });

  const handleOnRemove = async (e) => {
    e.stopPropagation();
    field.onChange("");
    await clearImageCache();
    setImageVersion(Date.now());
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
          style={{ height: "200px", padding: "1rem", position: "relative" }}
          {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
        >
          <input {...getInputProps()} />
          {field.value ? (
            <div>
              <Image
                src={getImageUrl()}
                alt={field.value}
                maxH="120px"
                objectFit="cover"
                borderRadius="md"
                key={imageVersion}
              />
              <CloseButton top={0} right={0} position="absolute" onClick={handleOnRemove} />
            </div>
          ) : isProcessing ? (
            <p>{t("common:loading")}</p>
          ) : (
            <p>{t("form:uploader.label")}</p>
          )}
        </Container>
      </Box>

      {hint && <Field color="gray.600" helperText={hint}></Field>}
    </Field>
  );
};
