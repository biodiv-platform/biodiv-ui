import { Box, FileUpload, Flex, GridItem, IconButton, SimpleGrid, Text } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import { axUploadResource } from "@services/files.service";
import { getTraitIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback } from "react";
import { LuX } from "react-icons/lu";

const ACCEPT_STRING = "image/jpeg, image/png, image/jpg";

export default function TraitsValueComponent({
  valueObj,
  index,
  onRemove,
  translationSelected,
  langId,
  onValueImageChange
}) {
  const { t } = useTranslation();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const targetFile = details.acceptedFiles[0];
      if (targetFile) {
        try {
          const { success, data } = await axUploadResource(targetFile, "traits", undefined);
          if (success) {
            onValueImageChange(index, data);
          }
        } catch (error) {
          console.error("Trait row graphic upload failure:", error);
        }
      }
    },
    [index, onValueImageChange]
  );

  return (
    <SimpleGrid columns={{ base: 1, md: 5 }} gap={{ md: 4 }} mb={4}>
      <Box>
        <TextBoxField
          key={`Value ${valueObj[translationSelected].values[index].value}`}
          name={`translations[${translationSelected}].values[${index}].value`}
          label={
            valueObj.filter((t) => t.traits.languageId == langId)[0].values[index].value &&
            valueObj[translationSelected].traits.languageId != langId
              ? valueObj.filter((t) => t.traits.languageId == langId)[0].values[index].value
              : `${t("traits:create_form.value")} ${index + 1}`
          }
          isRequired={true}
        />
      </Box>
      <GridItem colSpan={{ md: 2 }}>
        <TextBoxField
          key={`Value ${valueObj[translationSelected].values[index].description}`}
          name={`translations[${translationSelected}].values[${index}].description`}
          label={`${t("traits:create_form.description")} ${index + 1}`}
        />
      </GridItem>

      <Box display="flex" alignItems="flex-end" pb={1}>
        <FileUpload.Root accept={ACCEPT_STRING} onFileChange={handleFileChange} maxFiles={1}>
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone
            asChild
            border="2px dashed var(--chakra-colors-gray-300)"
            p={1}
            width="50px"
            height="50px"
            minH="auto"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            bg="white"
          >
            <FileUpload.Trigger asChild>
              <Box width="full" height="full">
                {valueObj[translationSelected].values[index].icon ? (
                  <Flex width="full" height="full" align="center" justify="center">
                    <img
                      src={getTraitIcon(valueObj[translationSelected].values[index].icon)}
                      alt="Trait Value Icon Preview"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                  </Flex>
                ) : (
                  <Flex width="full" height="full" align="center" justify="center">
                    <Text fontSize="lg" color="gray.400">
                      +
                    </Text>
                  </Flex>
                )}
              </Box>
            </FileUpload.Trigger>
          </FileUpload.Dropzone>
        </FileUpload.Root>
      </Box>

      {valueObj[translationSelected].traits.languageId == langId && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <IconButton
            aria-label="Remove value"
            onClick={(e) => {
              e.preventDefault();
              onRemove(index);
            }}
            size="sm"
            colorPalette="red"
          >
            <LuX />
          </IconButton>
        </Box>
      )}
    </SimpleGrid>
  );
}
