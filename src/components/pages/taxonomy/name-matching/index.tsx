import { ChevronDownIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spinner,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import UploadIcon from "@components/pages/observation/create-next/media-picker/upload-icon";
import ColumnMapper from "@components/pages/traits/common/column-mapper";
import { axCheckSpecies } from "@services/species.service";
import { axUploadTaxonFile } from "@services/taxonomy.service";
import notification from "@utils/notification";
import ExcelJS from "exceljs";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { useDropzone } from "react-dropzone";

import NameTable from "./name-table";

type TaxonData = {
  id: string; // or whatever the correct type is for 'id'
  name: string;
  rank: string;
  status: string;
  position: string;
};

export default function NameMatchingComponent() {
  const [uploadResult, setUploadResult] = useState<[string, TaxonData[]][]>([]);
  const [finalResult, setFinalResult] = useState<
    [string, TaxonData, any | null, boolean, number][]
  >([]);
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [columnMapping, setColumnMapping] = useState<[number, string][]>([]);
  const [filter, setFilter] = useState<string>("Matched");
  const { t } = useTranslation();
  const options = ["Scientific name"];
  const importAsExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.columns = [
      { header: "ScientificName", key: "ScientificName" },
      { header: "TaxonConceptId", key: "TaxonConceptId" },
      { header: "GroupName", key: "GroupName" },
      { header: "SpeciesId", key: "SpeciesId" }
    ];

    // Add new columns dynamically
    const newColumns = headers
      .filter((_, index) => index !== selectedColumn)
      .map((header) => ({
        header: header,
        key: header
      }));
    worksheet.columns = [...worksheet.columns, ...newColumns];
    finalResult.forEach((name) => {
      if (name[1] && filter != "Unmatched") {
        const row = {};
        for (let i = 0; i < headers.length; i++) {
          if (i != selectedColumn) {
            row[headers[i]] = name[0].slice(0, -1).split("|")[i];
          }
        }
        row["ScientificName"] = name[1]["name"];
        (row["TaxonConceptId"] = name[1]["id"]),
          (row["GroupName"] = name[1]["group_name"]),
          (row["SpeciesId"] = name[2]);
        worksheet.addRow(row);
      } else if (name[1] == undefined && filter != "Matched") {
        const row = {};
        for (let i = 0; i < headers.length; i++) {
          if (i != selectedColumn) {
            row[headers[i]] = name[0].slice(0, -1).split("|")[i];
          }
        }

        row["ScientificName"] = name[0].slice(0, -1).split("|")[
          selectedColumn ? selectedColumn : 0
        ];
        worksheet.addRow(row);
      }
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);

    // Create a link to trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "names.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const columnMappingSubmit = async () => {
    onClose1();
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    const foundItem = columnMapping.find(([, i]) => i === "Scientific name");
    if (foundItem) {
      setSelectedColumn(foundItem[0]);
      formData.append("column", foundItem[0].toString());
    }
    setLoading(true); // Add file to formData

    const { success, data, error } = await axUploadTaxonFile(formData);
    if (success) {
      setUploadResult(data.data.flatMap((obj) => Object.entries(obj)));
      setHeaders(data.headers);
      (async () => {
        const processedData = await Promise.all(
          data.data.flatMap((obj, objindex) =>
            Object.entries(obj).map(async ([key, value]: [string, TaxonData[]]) => {
              const { success, data } = await axCheckSpecies(value[0]?.id);
              if (success) {
                return [key, value[0], data, false, objindex]; // Ensure index is correctly mapped
              }
              return [key, value[0], null, false, objindex]; // Keep index consistent even on failure
            })
          )
        );
        setFinalResult(processedData);
        setLoading(false);
        setCurrentStep(2);
      })();
    } // Proceed to the next step
    else {
      setLoading(false);
      notification(error?.message || "Something went wrong!");
    }
  };
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        try {
          const workbook = new ExcelJS.Workbook();
          const arrayBuffer = await acceptedFiles[0].arrayBuffer();
          await workbook.xlsx.load(arrayBuffer);

          // Assuming the headers are in the first sheet and the first row
          const worksheet = workbook.worksheets[0]; // Get the first worksheet
          const firstRow = worksheet.getRow(1); // Get the first row
          const extractedHeaders: string[] = [];

          firstRow.eachCell((cell, colNumber) => {
            if (cell.value) {
              const cellValue = cell.value.toString();
              extractedHeaders.push(cellValue); // Extract the value of each cell
              if (
                cell.value.toString().toLowerCase() == "Sci Name".toLowerCase() ||
                cell.value.toString().toLowerCase() == "Scientific name".toLowerCase()
              ) {
                setColumnMapping((prev) => {
                  const updatedOptions = [...prev];

                  const existingIndex = updatedOptions.findIndex(([i]) => i === colNumber - 1);

                  if (existingIndex !== -1) {
                    // Update existing entry
                    updatedOptions[existingIndex] = [colNumber - 1, "Scientific name"];
                  } else {
                    // Add new entry
                    updatedOptions.push([colNumber - 1, "Scientific name"]);
                  }

                  return updatedOptions;
                });
              }
            }
          });
          setHeaders(extractedHeaders);
          onOpen1();
        } catch (error) {
          console.error("Error reading Excel file:", error);
        }
      } else {
        notification("No file selected!");
      }
    },
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
    },
    maxFiles: 1
  });

  const [currentStep, setCurrentStep] = useState(1);
  return (
    <Box p={4}>
      {/* Progress Bar */}
      <Alert status="info" borderRadius="md" mb={4} alignItems="top">
        {t("taxon:name_matching.description")}
      </Alert>
      <Box mt={6} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        {isLoading && <Spinner></Spinner>}
        {currentStep == 1 && !isLoading && (
          <Box
            {...getRootProps()}
            minH="calc(100vh - var(--heading-height))"
            bg={isDragActive ? "blue.100" : undefined}
            id="dropzone"
            cursor="inherit"
          >
            <input {...getInputProps()} />
            <Flex
              minH="calc(100vh - var(--heading-height))"
              alignItems="center"
              justifyContent="center"
            >
              <Flex flexDir="column" alignItems="center" p={4}>
                <UploadIcon size={100} />
                <Heading size="lg" fontWeight="normal" color="gray.400" mt={8}>
                {t("taxon:name_matching.upload_description")}
                </Heading>
                <Button colorScheme="blue" onClick={open} mb={8}>
                {t("taxon:name_matching.upload_button")}
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}
        <ColumnMapper
          options={options}
          manyOptions={[]}
          isOpen={isOpen1}
          onClose={onClose1}
          description={t("taxon:name_matching.columnMapping_description")}
          headers={headers}
          columnMapping={columnMapping}
          setColumnMapping={setColumnMapping}
          onSubmit={columnMappingSubmit}
          optionDisabled={columnMapping.filter(([, i]) => i === "Scientific name").length == 0}
        />
        {currentStep == 2 && (
          <>
            <Flex justifyContent="space-between" alignItems="center" bg="white" p={4}>
              {/* Left-aligned content */}
              <Text fontSize="lg">
                <Text as="span" color="blue.500" fontWeight="bold">
                  {uploadResult.filter(([, value]) => value.length != 0).length}
                </Text>{" "}
                out of{" "}
                <Text as="span" fontWeight="bold">
                  {uploadResult.length}
                </Text>{" "}
                names matched successfully.
              </Text>

              {/* Right-aligned content */}
              <Flex justifyContent="flex-end">
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {t("taxon:name_matching.download_button")}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={importAsExcel}>{t("taxon:name_matching.download_excel")}</MenuItem>
                    <MenuItem>
                      {" "}
                      <CSVLink
                        data={finalResult.map((name) => ({
                          Species: name[1]?.name,
                          TaxonId: name[1]?.id
                        }))}
                        filename="names.csv"
                      >
                        {t("taxon:name_matching.download_csv")}
                      </CSVLink>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
            <Box mb={4}>
              {uploadResult.filter(([, value]) => value.length == 0).length != 0 && (
                <Box bg="red.500" color="white" p={4} borderRadius="md" boxShadow="md" mb={4}>
                  <Text fontSize="md" fontWeight="bold">
                    <Icon as={WarningIcon} w={5} h={5} mr={4} />
                    {t("taxon:name_matching.warning_text")}
                  </Text>
                  {uploadResult
                    .filter(([, value]) => value.length == 0)
                    .map(([key]) => (
                      <Box ml={9}>
                        {selectedColumn != null && (
                          <Link
                            href={`/species/create?name=${
                              key.slice(0, -1).split("|")[selectedColumn]
                            }`}
                            target="_blank"
                          >
                            {key.slice(0, -1).split("|")[selectedColumn]}
                          </Link>
                        )}
                      </Box>
                    ))}
                  <Text>{t("taxon:name_matching.species_create_description")}</Text>
                </Box>
              )}
              <Box mb={4} width="100%">
                <Select
                  maxW="10rem"
                  ml="auto"
                  value={filter}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFilter(value);
                  }}
                >
                  <option value="All">{t("taxon:name_matching.all_filter")}</option>
                  <option value="Matched">{t("taxon:name_matching.matched_filter")}</option>
                  <option value="Unmatched">{t("taxon:name_matching.unmatched_filter")}</option>
                </Select>
              </Box>
              {filter == "Matched" && (
                <NameTable
                  finalResult={finalResult.filter(([, value, ,]) => value != undefined)}
                  selectedColumn={selectedColumn}
                  uploadResult={uploadResult}
                  setFinalResult={setFinalResult}
                  setUploadResult={setUploadResult}
                />
              )}
              {filter == "All" && (
                <NameTable
                  finalResult={finalResult}
                  selectedColumn={selectedColumn}
                  uploadResult={uploadResult}
                  setFinalResult={setFinalResult}
                  setUploadResult={setUploadResult}
                />
              )}
              {filter == "Unmatched" && (
                <NameTable
                  finalResult={finalResult.filter(([, value, ,]) => value == undefined)}
                  selectedColumn={selectedColumn}
                  uploadResult={uploadResult}
                  setFinalResult={setFinalResult}
                  setUploadResult={setUploadResult}
                />
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
