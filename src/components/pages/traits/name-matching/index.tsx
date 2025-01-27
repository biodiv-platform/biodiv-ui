import { ChevronDownIcon, EditIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
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
  Spinner,
  Text
} from "@chakra-ui/react";
import UploadIcon from "@components/pages/observation/create-next/media-picker/upload-icon";
import DeleteIcon from "@icons/delete";
import { axCheckSpecies } from "@services/species.service";
import { axUploadTaxonFile } from "@services/taxonomy.service";
import { TAXON_BADGE_COLORS } from "@static/constants";
import ExcelJS from "exceljs";
import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { useDropzone } from "react-dropzone";

type TaxonData = {
  id: string; // or whatever the correct type is for 'id'
  name: string;
  rank: string;
  status: string;
  position: string;
};

export default function NameMatchingComponent() {
  const [uploadResult, setUploadResult] = useState<[string, TaxonData[]][]>([]);
  const [finalResult, setFinalResult] = useState<[string, TaxonData, any | null, boolean][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const importAsExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.columns = [
      { header: "Species", key: "Species" },
      { header: "TaxonConceptId", key: "TaxonConceptId" },
      { header: "GroupName", key: "GroupName" },
      { header: "SpeciesId", key: "SpeciesId" }
    ];

    // Add new columns dynamically
    const newColumns = headers.slice(1).map((header) => ({
      header: header,
      key: header
    }));
    worksheet.columns = [...worksheet.columns, ...newColumns];
    finalResult.forEach((name) => {
      if (name[1]) {
        const row = {};
        for (let i = 1; i < headers.length; i++) {
          row[headers[i]] = name[0].slice(0, -1).split("|")[i];
        }
        row["Species"] = name[1]["name"];
        (row["TaxonConceptId"] = name[1]["id"]),
          (row["GroupName"] = name[1]["group_name"]),
          (row["SpeciesId"] = name[2]);
        worksheet.addRow(row);
      } else {
        worksheet.addRow({});
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
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);
        setLoading(true); // Add file to formData

        const { success, data } = await axUploadTaxonFile(formData);
        if (success) {
          setUploadResult(data.data.flatMap((obj) => Object.entries(obj)));
          setHeaders(data.headers);
          (async () => {
            const processedData = await Promise.all(
              data.data.flatMap((obj) =>
                Object.entries(obj).map(async ([key, value]: [string, TaxonData[]]) => {
                  const { success, data } = await axCheckSpecies(value[0]?.id);
                  if (success) {
                    return [key, value[0], data, false]; // Return key and the first item of the value array
                  }
                  return [key, value[0], null, false]; // Return the original key-value pair even if unsuccessful
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
          alert("Something went wrong!");
        }
      } else {
        alert("No file selected!");
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
                  {"Drag and Drop excel files"}
                </Heading>
                <Button colorScheme="blue" onClick={open} mb={8}>
                  {"Browse"}
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}
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
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    disabled={uploadResult.filter(([, value]) => value.length == 0).length != 0}
                  >
                    Import As
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={importAsExcel}>Microsoft Excel (.xlsx)</MenuItem>
                    <MenuItem>
                      {" "}
                      <CSVLink
                        data={finalResult.map((name) => ({
                          Species: name[1]?.name,
                          TaxonId: name[1]?.id
                        }))}
                        filename="names.csv"
                      >
                        Comma Seperated Values (.csv)
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
                    Warning: {"Couldn't find any matches for the following species name"}!
                  </Text>
                  {uploadResult
                    .filter(([, value]) => value.length == 0)
                    .map(([key]) => (
                      <Box ml={9}>
                        <Link href={`/species/create?name=${key.slice(0, -1).split("|")[0]}`}>
                          {key.slice(0, -1).split("|")[0]}
                        </Link>
                      </Box>
                    ))}
                  <Text>Click on species name for creating species</Text>
                </Box>
              )}
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>{"Species Name"}</th>
                    <th>{"Name Matches"}</th>
                  </tr>
                </thead>
                <tbody>
                  {finalResult &&
                    finalResult.map((item, index) => (
                      <tr>
                        <td>
                          <DeleteIcon
                            ml={2}
                            mr={4}
                            color={"red"}
                            cursor="pointer"
                            onClick={() => {
                              setFinalResult(finalResult.filter((_, i) => i !== index));
                              setUploadResult(uploadResult.filter((_, i) => i != index));
                            }}
                          />
                          {item[0].slice(0, -1).split("|")[0]}
                        </td>
                        <td>
                          {item[3] == false && (
                            <Text m={4}>
                              {item[1]?.name}
                              <Badge ml={2}>{item[1]?.rank}</Badge>
                              <Badge ml={2} colorScheme={TAXON_BADGE_COLORS[item[1]?.status]}>
                                {item[1]?.status}
                              </Badge>
                              <Badge ml={2} colorScheme={TAXON_BADGE_COLORS[item[1]?.position]}>
                                {item[1]?.position}
                              </Badge>
                              {uploadResult[index][1].length > 1 && (
                                <Text float="right" color="green.700" fontWeight="bold">
                                  {uploadResult[index][1].length + " Matches Found"}
                                  <EditIcon
                                    ml={2}
                                    color="teal"
                                    cursor="pointer"
                                    onClick={() => {
                                      const updatedMatching = [...finalResult];
                                      updatedMatching[index][3] = true;
                                      setFinalResult(updatedMatching);
                                    }}
                                  />
                                </Text>
                              )}
                              {uploadResult[index][1].length == 1 && (
                                <Text float="right" color="green.700" fontWeight="bold">
                                  {"1 Match Found"}
                                </Text>
                              )}
                              {uploadResult[index][1].length == 0 && (
                                <Text float="right" color="red.700" fontWeight="bold">
                                  {"No Match Found"}
                                </Text>
                              )}
                            </Text>
                          )}
                          {item[2] && item[3] == false && (
                            <Alert bg="blue.50">
                              <AlertIcon />
                              <Text>{"Species Page exists for this name match"}</Text>
                            </Alert>
                          )}
                          {item[3] == true && (
                            <Box>
                              {uploadResult &&
                                uploadResult[index][1].map((option) => (
                                  <Box
                                    padding={4}
                                    _hover={{
                                      bg: "lightgrey"
                                    }}
                                    cursor="pointer"
                                    onClick={async () => {
                                      const updatedMatching = [...finalResult];
                                      updatedMatching[index][1] = option;
                                      const { success, data } = await axCheckSpecies(option["id"]);
                                      if (success) {
                                        updatedMatching[index][2] = data;
                                      } else {
                                        updatedMatching[index][2] = null;
                                      }
                                      updatedMatching[index][3] = false;
                                      setFinalResult(updatedMatching);
                                    }}
                                  >
                                    {option["name"]}
                                    <Badge ml={2}>{option["rank"]}</Badge>
                                    <Badge
                                      ml={2}
                                      colorScheme={TAXON_BADGE_COLORS[option["status"]]}
                                    >
                                      {option["status"]}
                                    </Badge>
                                    <Badge
                                      ml={2}
                                      colorScheme={TAXON_BADGE_COLORS[option["position"]]}
                                    >
                                      {option["position"]}
                                    </Badge>
                                    {option["id"] == item[1]?.id && (
                                      <Badge ml={2} colorScheme="blue">
                                        {"Selected"}
                                      </Badge>
                                    )}
                                  </Box>
                                ))}
                            </Box>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
