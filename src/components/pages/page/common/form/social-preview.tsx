import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Image
} from "@chakra-ui/react";
import { axUploadResource } from "@services/files.service";
import { resizeImage } from "@utils/image";
import { getResourceRAW, RESOURCE_CTX } from "@utils/media";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";

import { Container, ITPageGalleryFieldProps } from "./gallery-field";

export const SocialPreviewField = ({
  helpText,
  label,
  name,
  placeholder,
  title,
  mb = 4,
  disabled,
  hint,
  isRequired,
  hidden,
  onRemoveCallback,
  ...props
}: ITPageGalleryFieldProps) => {
  const { t } = useTranslation();
  const { field } = useController({ name });

  const [isProcessing, setIsProcessing] = useState(false);
  const { formState } = useFormContext();

  const onDrop = async ([file]) => {
    if (!file) return;

    setIsProcessing(true);
    const [fileSm] = await resizeImage(file);
    const { success, data } = await axUploadResource(new File([fileSm], file.name), "pages");
    if (success) {
      field.onChange(data);
    } else {
      notification(t("user:update_error"));
    }
    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"]
    },
    multiple: false,
    onDrop
  });

  const handleOnRemove = (e) => {
    e.stopPropagation();
    field.onChange("");
  };

  return (
    <FormControl
      isInvalid={!!formState.errors[name]}
      mb={mb}
      hidden={hidden}
      isRequired={isRequired}
      {...props}
    >
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      {/* Dropzone */}
      <div id={name}>
        <Container
          style={{ height: "124px", padding: "1rem", position: "relative" }}
          {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
        >
          <input {...getInputProps()} />
          {field.value ? (
            <div>
              <Image
                src={getResourceRAW(RESOURCE_CTX.PAGES, field.value)}
                alt={field.value}
                maxH="120px"
                objectFit="cover"
                borderRadius="md"
              />
              <CloseButton top={0} right={0} position="absolute" onClick={handleOnRemove} />
            </div>
          ) : isProcessing ? (
            <p>{t("common:loading")}</p>
          ) : (
            <p>{t("form:uploader.label")}</p>
          )}
        </Container>
      </div>

      <FormErrorMessage children={formState?.errors?.[name]?.message?.toString()} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
