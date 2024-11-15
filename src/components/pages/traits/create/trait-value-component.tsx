import { CloseIcon } from "@chakra-ui/icons";
import { Box, GridItem, IconButton, Input, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { useDropzone } from "react-dropzone";

export default function TraitsValueComponent({ valueObj, index, onValueChange, onRemove }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onValueChange(index, { ...valueObj, file: acceptedFiles[0] });
      }
    }
  });
  return (
    <SimpleGrid columns={{ base: 1, md: 5 }} spacing={{ md: 4 }} mb={4}>
      <Box>
        <Input
          placeholder="Name"
          value={valueObj.value}
          onChange={(e) => onValueChange(index, { ...valueObj, value: e.target.value })}
          required
        />
      </Box>
      <GridItem colSpan={{ md: 2 }}>
        <Input
          placeholder="Description"
          value={valueObj.description}
          onChange={(e) => onValueChange(index, { ...valueObj, description: e.target.value })}
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
          {valueObj.file ? (
            <img
              src={URL.createObjectURL(valueObj.file)}
              alt="Trait Value Icon Preview"
              style={{ width: "40px", height: "40px" }}
            />
          ) : (
            <p style={{ padding: "5px" }}>+</p>
          )}
        </div>
      </Box>
      <Box>
        <IconButton
          aria-label="Remove value"
          icon={<CloseIcon />}
          onClick={() => onRemove(index)}
          size="sm"
          colorScheme="red"
        />
      </Box>
    </SimpleGrid>
  );
}
