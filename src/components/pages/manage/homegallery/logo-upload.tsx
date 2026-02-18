import { Box, CloseButton, Image } from "@chakra-ui/react";
import { axUploadResource } from "@services/files.service";
import { resizeImage } from "@utils/image";
import { getResourceRAW, RESOURCE_CTX } from "@utils/media";
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
  const { formState } = useFormContext();

  const onDrop = async ([file]) => {
    if (!file) return;

    setIsProcessing(true);
    const [fileSm] = await resizeImage(file);
    const { success, data } = await axUploadResource(
      new File([fileSm], name + ".png"),
      "site",
      name
    );
    if (success) {
      field.onChange(data);
    } else {
      notification(t("user:update_error"));
    }
    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "image/*": [".png"]
    },
    multiple: false,
    onDrop
  });

  const handleOnRemove = (e) => {
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

      {/* Dropzone */}
      <Box id={name} width={"full"}>
        <Container
          style={{ height: "200px", padding: "1rem", position: "relative" }}
          {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
        >
          <input {...getInputProps()} />
          {field.value ? (
            <div>
              <Image
                src={getResourceRAW(RESOURCE_CTX.SITE, field.value)}
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
      </Box>

      {hint && <Field color="gray.600" helperText={hint}></Field>}
    </Field>
  );
};
