import { CloseIcon } from "@chakra-ui/icons";
import { Box, GridItem, IconButton, SimpleGrid } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import { axUploadResource } from "@services/files.service";
import { getTraitIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useDropzone } from "react-dropzone";

export default function TraitsValueComponent({
  valueObj,
  index,
  onRemove,
  translationSelected,
  langId,
  onValueImageChange
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const { success, data } = await axUploadResource(acceptedFiles[0], "traits", undefined);
        if (success) {
          onValueImageChange(index, data);
        }
      }
    }
  });
  const { t } = useTranslation();
  return (
    <SimpleGrid columns={{ base: 1, md: 5 }} spacing={{ md: 4 }} mb={4}>
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
        />
      </Box>
      <GridItem colSpan={{ md: 2 }}>
        <TextBoxField
          key={`Value ${valueObj[translationSelected].values[index].description}`}
          name={`translations[${translationSelected}].values[${index}].description`}
          label={`${t("traits:create_form.description")} ${index + 1}`}
        />
      </GridItem>
      <Box>
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #aaa",
            padding: "5px",
            textAlign: "center",
            width: "50px",
            height: "50px"
          }}
        >
          <input {...getInputProps()} />
          {valueObj[translationSelected].values[index].icon ? (
            <img
              src={getTraitIcon(valueObj[translationSelected].values[index].icon)}
              alt="Trait Value Icon Preview"
              style={{ width: "40px", height: "40px" }}
            />
          ) : (
            <p style={{ padding: "5px" }}>+</p>
          )}
        </div>
      </Box>
      {valueObj[translationSelected].traits.languageId == langId && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <IconButton
            aria-label="Remove value"
            icon={<CloseIcon />}
            onClick={() => onRemove(index)}
            size="sm"
            colorScheme="red"
          />
        </Box>
      )}
    </SimpleGrid>
  );
}
