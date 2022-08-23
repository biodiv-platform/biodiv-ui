import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Image,
  SimpleGrid,
  Stack
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { axUploadResource } from "@services/files.service";
import { resizeImage } from "@utils/image";
import { getResourceRAW, RESOURCE_CTX } from "@utils/media";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFieldArray, useFormContext } from "react-hook-form";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-radius: 0.25rem;
  height: 200px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background: #fff;
  border-color: var(--chakra-colors-gray-300);
`;

interface ITPageGalleryFieldProps {
  helpText?: string;
  label: string;
  name: string;
  placeholder?: string;
  title?: string;
  type?: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  style?;
  isRequired?: boolean;
  hidden?;
  autoComplete?;
  onRemoveCallback?;
}

export const PageGalleryField = ({
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
  const [isProcessing, setIsProcessing] = useState(false);
  const { formState } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ name, keyName: "hId" });

  const onDrop = async (files) => {
    if (!files?.length) return;

    setIsProcessing(true);

    for (const file of files) {
      const [fileSm] = await resizeImage(file);
      const { success, data } = await axUploadResource(new File([fileSm], file.name), "pages");
      if (success) {
        append({ id: null, fileName: data });
      } else {
        notification(t("user:update_error"));
      }
    }

    setIsProcessing(false);
  };
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"]
    },
    multiple: true,
    onDrop
  });

  const handleOnRemove = (item, index) => {
    remove(index);

    if (item.id && item.pageId && onRemoveCallback) {
      onRemoveCallback(item.pageId, item.id);
    }
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
        <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
          <input {...getInputProps()} />
          {isProcessing ? (
            <p>{t("common:loading")}</p>
          ) : (
            <p>Drag n drop some images here, or click to select files</p>
          )}
        </Container>
      </div>

      {/* Preview */}
      {fields && (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} pt={4} maxW="full">
          {fields?.map((item: any, index) => (
            <Box
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              key={item.hId}
              p={2}
              position="relative"
              w="full"
              bg="white"
            >
              <CloseButton
                bg="red.500"
                _hover={{ bg: "red.600" }}
                color="white"
                size="sm"
                zIndex={1}
                position="absolute"
                top={0}
                right={0}
                m={4}
                onClick={() => handleOnRemove(item, index)}
              />
              <Stack>
                <AspectRatio ratio={1440 / 300}>
                  <Image
                    src={getResourceRAW(RESOURCE_CTX.PAGES, item?.fileName)}
                    alt={item?.fileName}
                    objectFit="cover"
                    borderRadius="md"
                  />
                </AspectRatio>
                <SimpleGrid columns={2} spacing={2}>
                  <IconButton
                    onClick={() => move(index, index - 1)}
                    isDisabled={index === 0}
                    icon={<ArrowBackIcon />}
                    aria-label={t("common:prev")}
                  />
                  <IconButton
                    onClick={() => move(index, index + 1)}
                    isDisabled={index === fields.length - 1}
                    icon={<ArrowForwardIcon />}
                    aria-label={t("common:next")}
                  />
                </SimpleGrid>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <FormErrorMessage children={formState?.errors?.[name]?.message?.toString()} />
      {hint && <FormHelperText color="gray.600">{hint}</FormHelperText>}
    </FormControl>
  );
};
