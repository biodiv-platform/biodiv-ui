import { Box, Flex, Heading } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";

import { FileWithType } from "../file-with-type";
import RasterUploadForm from "../form/raster-form";
import { VectorFormFields } from "../form/vector-form";
import useLayerUpload, {
  FileUploadState,
  FileUploadStatus,
  MapFileType
} from "../use-layer-upload";

const STATUS_COLOR: Record<FileUploadStatus, string> = {
  [FileUploadStatus.Idle]: "gray.500",
  [FileUploadStatus.Uploading]: "blue.500",
  [FileUploadStatus.Done]: "green.600",
  [FileUploadStatus.Error]: "red.500"
};

const SingleFile = ({
  type,
  name,
  upload
}: {
  type: string;
  name?: string;
  upload?: FileUploadState;
}) =>
  name ? (
    <Flex
      bg="gray.50"
      mb={2}
      direction="column"
      p={2}
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
    >
      <Flex alignItems="center" w="100%">
        <FileWithType type={type} />
        <Box className="text-elipsis" ml={3} flexGrow={1}>
          {name}
        </Box>
        <Box
          fontSize="xs"
          fontWeight="bold"
          color={STATUS_COLOR[upload?.status ?? FileUploadStatus.Idle]}
          ml={2}
        >
          {upload?.status === FileUploadStatus.Done && "✓"}
          {upload?.status === FileUploadStatus.Error && "failed"}
          {upload?.status === FileUploadStatus.Uploading && `${upload.percent}%`}
        </Box>
      </Flex>
      {upload?.status === FileUploadStatus.Uploading && (
        <Box w="100%" h="4px" bg="gray.200" mt={2} borderRadius="full" overflow="hidden">
          <Box h="100%" bg="blue.400" w={`${upload.percent}%`} transition="width 0.2s" />
        </Box>
      )}
    </Flex>
  ) : null;

export default function FilePreview() {
  const { shapeFiles, mapFileType, rasterFiles, fileUploadState } = useLayerUpload();
  const { t } = useTranslation();

  const hasRasterFile = Boolean(rasterFiles.tif.file);
  const hasVectorFile = Boolean(
    shapeFiles.shp.file || shapeFiles.dbf.file || shapeFiles.shx.file
  );
  const fileType = mapFileType === MapFileType.raster ? rasterFiles : shapeFiles;

  return (
    <Box gridColumn={{ base: "1", md: "6/8" }} h="100%" overflowY="auto" pl={{ md: 2 }}>
      <Box mb={4}>
        <Heading as="h2" size="md" mb={2}>
          📄 {t("map:your_files")}
        </Heading>
        {fileType &&
          Object.keys(fileType).map((type) => (
            <SingleFile
              type={type}
              key={type}
              name={fileType?.[type]?.file?.name}
              upload={fileUploadState[type]}
            />
          ))}
      </Box>
      {mapFileType === MapFileType.raster && hasRasterFile && <RasterUploadForm />}
      {mapFileType === MapFileType.vector && hasVectorFile && <VectorFormFields />}
    </Box>
  );
}
