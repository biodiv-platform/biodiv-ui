import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { FileWithType } from "../file-with-type";
import LayerUploadForm from "../form";
import useLayerUpload, { MapFileType } from "../use-layer-upload";

const SingleFile = ({ type, name }) =>
  name ? (
    <Flex
      bg="gray.50"
      mb={2}
      alignItems="center"
      p={2}
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
    >
      <FileWithType type={type} />{" "}
      <Box className="text-elipsis" ml={3}>
        {name}
      </Box>
    </Flex>
  ) : null;

export default function FilePreview() {
  const { shapeFiles, mapFileType, rasterFiles, canContinue, setScreen } = useLayerUpload();
  const { t } = useTranslation();

  const fileType = rasterFiles.tif.file ? rasterFiles : shapeFiles;
  return (
    <Flex h="100%" gridColumn="6/8" direction="column" justifyContent="space-between">
      <Box>
        <Heading as="h2" size="md" mb={2}>
          📄 {t("map:your_files")}
        </Heading>
        {fileType &&
          Object.keys(fileType).map((type) => (
            <SingleFile type={type} key={type} name={fileType?.[type]?.file?.name} />
          ))}
      </Box>
      {mapFileType === MapFileType.raster && rasterFiles.tif.file ? (
        <LayerUploadForm />
      ) : (
        <Button
          w="100%"
          colorScheme="blue"
          size="lg"
          disabled={!canContinue}
          onClick={() => setScreen(1)}
        >
          {t("map:continue")}
        </Button>
      )}
    </Flex>
  );
}
