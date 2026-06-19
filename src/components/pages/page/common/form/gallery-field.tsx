import {
  AspectRatio,
  Box,
  CloseButton,
  FileUpload,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Stack
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { axUploadResource } from "@services/files.service";
import { axGetLicenseList } from "@services/resources.service";
import { resizeImage } from "@utils/image";
import { getResourceRAW, RESOURCE_CTX } from "@utils/media";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

import { Field } from "@/components/ui/field";
import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";

type DragProps = {
  isDragActive?: boolean;
  isDragAccept?: boolean;
  isDragReject?: boolean;
};

export const getColor = (props: DragProps) => {
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

export const Container = styled.div<DragProps>`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-radius: 0.25rem;
  height: 200px;
  width: 100%; /* FIX: Force the container to take up the full width */
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background: #fff;
  border-color: var(--chakra-colors-gray-300);
`;

export interface ITPageGalleryFieldProps {
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

const ACCEPT_STRING = "image/jpeg, image/png, image/jpg";

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
  const { formState, register } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ name, keyName: "hId" });
  const [licenses, setLicenses] = useState<any[]>();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const { acceptedFiles, rejectedFiles } = details;

      if (rejectedFiles && rejectedFiles.length > 0) {
        notification("Format not supported. Please upload valid images.");
      }

      if (!acceptedFiles?.length) return;

      setIsProcessing(true);
      try {
        for (const file of acceptedFiles) {
          const [fileSm] = await resizeImage(file);
          const { success, data } = await axUploadResource(new File([fileSm], file.name), "pages");
          if (success) {
            append({ id: null, fileName: data });
          } else {
            notification(t("user:update_error"));
          }
        }
      } catch (error) {
        console.error("Upload error:", error);
        notification(t("user:update_error"));
      } finally {
        setIsProcessing(false);
      }
    },
    [append, t]
  );

  const handleOnRemove = (item, index) => {
    remove(index);

    if (item.id && item.pageId && onRemoveCallback) {
      onRemoveCallback(item.pageId, item.id);
    }
  };

  useEffect(() => {
    axGetLicenseList().then(({ data }) => {
      setLicenses(data);
    });
  }, []);

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
      <Box id={name} width={"full"} p={2}>
        <FileUpload.Root
          accept={ACCEPT_STRING}
          onFileChange={handleFileChange}
          maxFiles={10}
          disabled={disabled || isProcessing}
          width="full"
        >
          <FileUpload.HiddenInput />

          <FileUpload.Context>
            {(fileUpload) => (
              <FileUpload.Dropzone asChild>
                <Container
                  isDragActive={fileUpload.dragging}
                  isDragAccept={false}
                  isDragReject={false}
                >
                  {isProcessing ? (
                    <p>{t("common:loading")}</p>
                  ) : (
                    <p>Drag n drop some images here, or click to select files</p>
                  )}
                </Container>
              </FileUpload.Dropzone>
            )}
          </FileUpload.Context>
        </FileUpload.Root>
      </Box>

      {/* Preview */}
      {fields && (
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} pt={4} maxW="full">
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
                onClick={(e) => {
                  e.preventDefault();
                  handleOnRemove(item, index);
                }}
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
                <Input {...register(`${name}.${index}.caption`)} placeholder={t("form:caption")} />
                <Input
                  {...register(`${name}.${index}.attribution`)}
                  placeholder={t("form:attribution")}
                />
                {licenses && (
                  <NativeSelectRoot>
                    <NativeSelectField
                      {...register(`${name}.${index}.licenseId`)}
                      defaultValue={item.licenseId || licenses[0].value}
                    >
                      {licenses.map((l) => (
                        <option value={l.value} key={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                )}
                <SimpleGrid columns={2} gap={2}>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      move(index, index - 1);
                    }}
                    disabled={index === 0}
                    aria-label={t("common:prev")}
                    variant={"subtle"}
                  >
                    <LuArrowLeft />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      move(index, index + 1);
                    }}
                    disabled={index === fields.length - 1}
                    aria-label={t("common:next")}
                    variant={"subtle"}
                  >
                    <LuArrowRight />
                  </IconButton>
                </SimpleGrid>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {hint && <Field color="gray.600" helperText={hint} />}
    </Field>
  );
};
