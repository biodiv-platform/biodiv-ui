import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import React from "react";

import FilePreview from "../common/file-preview";
import useManageDocument from "../document-upload-provider";

export default function MyDocumentUploads() {
  const { documentList, deleteMyUploadsDocument, selectMyUploadsDocument } = useManageDocument();

  return (
    <Box mb={4} h="14.4rem" overflowX="auto">
      <SimpleGrid columns={[1, 2, 2, 3]} gap={4}>
        {documentList?.map((d) => (
          <FilePreview
            fileName={d.fileName}
            date={d.dateUploaded}
            key={d.hashKey}
            onSelect={() => selectMyUploadsDocument(d)}
            onDelete={() => deleteMyUploadsDocument(d)}
          />
        ))}
      </SimpleGrid>
      {documentList?.length === 0 && (
        <Flex
          bg="gray.100"
          h="full"
          borderColor="gray.300"
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
          color="gray.500"
        >
          No Files
        </Flex>
      )}
    </Box>
  );
}
