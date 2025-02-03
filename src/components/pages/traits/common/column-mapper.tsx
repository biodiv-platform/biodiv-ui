import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text
} from "@chakra-ui/react";
import React from "react";

const ColumnMapper = ({
  options,
  manyOptions,
  isOpen,
  onClose,
  description,
  headers,
  columnMapping,
  setColumnMapping,
  optionDisabled,
  onSubmit
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Column Mapping</ModalHeader>
        <ModalBody>
          <Text>{description}</Text>
          {headers.map((column, index) => {
            const selectedValue = columnMapping.find(([i]) => i === index)?.[1] || "";
            return (
              <Box borderWidth={"thin"} m={2} borderRadius="md">
                <SimpleGrid columns={2} m={2}>
                  <Text>{column}</Text>
                  <Select
                    id="dataType"
                    name="dataType"
                    value={selectedValue}
                    onChange={(e) => {
                      const { value } = e.target;
                      setColumnMapping((prev) => {
                        const updatedOptions = [...prev];

                        // Find if the index already exists
                        const existingIndex = updatedOptions.findIndex(([i]) => i === index);

                        if (existingIndex !== -1) {
                          // Update existing entry
                          updatedOptions[existingIndex] = [index, value];
                        } else {
                          // Add new entry
                          updatedOptions.push([index, value]);
                        }

                        return updatedOptions;
                      });
                    }}
                    placeholder=" "
                    required
                  >
                    {options.map((field) => (
                      <option
                        value={field.toString()}
                        style={{ cursor: "pointer" }}
                        disabled={columnMapping.some(([, i]) => i === field)}
                      >
                        {field}
                      </option>
                    ))}
                    {manyOptions.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </Select>
                </SimpleGrid>
              </Box>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            onClick={() => {
              setColumnMapping([]);
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button colorScheme="blue" disabled={optionDisabled} onClick={onSubmit}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ColumnMapper;
