import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useDropzone } from "react-dropzone";

import { FILE_TYPES } from "../data";
import useLayerUpload from "../use-layer-upload";
import FilePreview from "./file-preview";
import { parseDBF, parseDefault, parseSHP } from "./parsers";

export default function LayerUploadDropzone() {
  const { updateShapeFile } = useLayerUpload();
  const { t } = useTranslation();

  const onDrop = async (files) => {
    for (const file of files) {
      if (file.name.endsWith(FILE_TYPES.DBF)) {
        parseDBF(file, updateShapeFile);
      } else if (file.name.endsWith(FILE_TYPES.SHP)) {
        parseSHP(file, updateShapeFile);
      } else {
        parseDefault(file, updateShapeFile);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "*/*": Object.values(FILE_TYPES) },
    multiple: true
  });

  return (
    <SimpleGrid columns={{ base: 1, md: 7 }} spacing={4} h="100%">
      <Flex
        {...getRootProps()}
        gridColumn="1/6"
        h="100%"
        bg="gray.50"
        border="1px dashed"
        borderColor="gray.300"
        borderRadius="md"
        alignItems="center"
        justifyContent="center"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Box>{t("map:drag_active")}</Box>
        ) : (
          <Box textAlign="center">
            {t("map:drop_message")}
            <br />
            <Text color="gray.500">
              {Object.values(FILE_TYPES).join(", ")} {t("map:only")}
            </Text>
          </Box>
        )}
      </Flex>
      <FilePreview />
    </SimpleGrid>
  );
}
