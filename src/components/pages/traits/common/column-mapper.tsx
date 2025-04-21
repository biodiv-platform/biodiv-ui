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
import useTranslation from "next-translate/useTranslation";
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
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Column Mapping</ModalHeader>
        <ModalBody>
          <Text>{description}</Text>
          {headers.map((column) => {
            const selectedValue = columnMapping.find(([i]) => i === parseInt(column.split("|")[1]))?.[1] || "";
            return (
              <Box borderWidth={"thin"} m={2} borderRadius="md">
                <SimpleGrid columns={2} m={2}>
                  <Text>{column.split("|")[0]}</Text>
                  <Select
                    id="dataType"
                    name="dataType"
                    value={selectedValue}
                    onChange={(e) => {
                      const { value } = e.target;
                      setColumnMapping((prev) => {
                        const updatedOptions = [...prev];

                        // Find if the index already exists
                        const existingIndex = updatedOptions.findIndex(([i]) => i === parseInt(column.split("|")[1]));

                        if (existingIndex !== -1) {
                          // Update existing entry
                          updatedOptions[existingIndex] = [parseInt(column.split("|")[1]), value];
                        } else {
                          // Add new entry
                          updatedOptions.push([parseInt(column.split("|")[1]), value]);
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
                    {manyOptions.map((traitsCat) => (
                      <optgroup label={"Traits (" + traitsCat[0] + ")"}>
                        {traitsCat[1].map((trait) => (
                          <option
                            key={trait}
                            value={trait}
                            disabled={columnMapping.some(([, i]) => i === trait)}
                          >
                            {trait.split("|")[1]}
                          </option>
                        ))}
                      </optgroup>
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
            {t("traits:trait_matching.cancel")}
          </Button>
          <Button colorScheme="blue" disabled={optionDisabled} onClick={onSubmit}>
            {t("traits:trait_matching.continue")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ColumnMapper;
