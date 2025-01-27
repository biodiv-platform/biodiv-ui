import { WarningIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Progress,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import UploadIcon from "@components/pages/observation/create-next/media-picker/upload-icon";
import { axUpdateSpeciesTrait, axUploadTraitsFile } from "@services/traits.service";
import { axGetUserList } from "@services/user.service";
import { getTraitIcon } from "@utils/media";
import notification from "@utils/notification";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function TraitsBatchUpload() {
  const [uploadResult, setUploadResult] = useState<Map<string, string>[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [successfulUpload, setSuccessfulUpload] = useState(0);
  const [failedUpload, setFailedUpload] = useState(0);
  const [showstats, setshowstats] = useState(false);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]); // Add file to formData

        const { success, data } = await axUploadTraitsFile(formData);
        if (success) {
          setUploadResult(data);
          setCurrentStep(2);
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

  const handleSubmit = async () => {
    setshowstats(true);
    for (let i = 0; i < uploadResult.length; i++) {
      const item = Object.entries(uploadResult[i]).filter(([key]) => key.split("|")[1] == "true");
      const facts = {};
      item.map(([key, value]) => {
        if (
          key.split("|")[2] == "STRING" &&
          value &&
          value
            .slice(0, -1)
            .split(",")
            .filter((value) => value.split("|")[0] === "NoMatch").length == 0
        ) {
          facts[key.split("|")[3]] = value
            .slice(0, -1)
            .split(",")
            .map((trait) => trait.split("|")[0]);
        }
        if (key.split("|")[2] == "NUMERIC" && value) {
          facts[key.split("|")[3]] = [value];
        }
        if (key.split("|")[2] == "DATE" && value) {
          const dates: string[] = [];
          if (value.split("|")[1] == "MONTH") {
            value
              .split("|")[0]
              .split(":")
              .forEach((date) => {
                dates.push(dayjs(`${dayjs().year()}-${date}-01`).format("YYYY-MM-DD"));
              });
          } else if (value.split("|")[1] == "YEAR") {
            value
              .split("|")[0]
              .split(":")
              .forEach((date) => {
                dates.push(dayjs(`${date}-01-01`).format("YYYY-MM-DD"));
              });
          } else {
            value
              .split("|")[0]
              .split(":")
              .forEach((date) => {
                dates.push(dayjs(date).format("YYYY-MM-DD"));
              });
          }
          facts[key.split("|")[3]] = dates;
        }
        if (key.split("|")[2] == "COLOR" && value) {
          facts[key.split("|")[3]] = value.slice(0, -1).split("|");
        }
      });
      const { success, data } = await axGetUserList({ email: uploadResult[i]["Contributor"] });
      if (success) {
        if (Object.keys(facts).length != 0) {
          if (uploadResult[i]["SpeciesId"] && uploadResult[i]["TaxonConceptId"]) {
            const { success } = await axUpdateSpeciesTrait(
              parseInt(uploadResult[i]["SpeciesId"], 10),
              facts,
              data["userList"][0]["id"],
              parseInt(uploadResult[i]["TaxonConceptId"], 10)
            );
            if (success) {
              setSuccessfulUpload((prev) => prev + 1);
            } else {
              setFailedUpload((prev) => prev + 1);
              notification(
                `Something went wrong while adding traits to ${uploadResult[i]["Species"]}`
              );
            }
          } else if (!uploadResult[i]["TaxonConceptId"]) {
            setFailedUpload((prev) => prev + 1);
            notification(`Taxon Id not available for ${uploadResult[i]["Species"]}`);
          } else if (!uploadResult[i]["SpeciesId"]) {
            setFailedUpload((prev) => prev + 1);
            notification(`Species Page doesn't exist for ${uploadResult[i]["Species"]}`);
          }
        }
      } else {
        setFailedUpload((prev) => prev + 1);
        notification(`Couldn't retrieve userId of ${uploadResult[i]["Contributor"]}`);
      }
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
  return (
    <Box p={4}>
      {currentStep == 1 && (
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
      {currentStep != 1 && (
        <>
          {showstats && (
            <Box textAlign="center" p={4} borderWidth="1px" borderRadius="md" boxShadow="md" mb={2}>
              <Heading
                size="md"
                mb={2}
                color={
                  successfulUpload + failedUpload === uploadResult.length ? "green.600" : "blue.600"
                }
              >
                {successfulUpload + failedUpload === uploadResult.length
                  ? failedUpload > 0
                    ? "Traits Saved"
                    : "Traits Uploaded Successfully"
                  : "Processing..."}
              </Heading>

              <Text fontSize="sm" color="gray.600">
                {successfulUpload + failedUpload === uploadResult.length
                  ? failedUpload > 0
                    ? "Some traits failed to upload. Please review the errors."
                    : "All traits have been uploaded successfully."
                  : "Please wait while the traits are being uploaded."}
              </Text>

              <Box mt={4}>
                <Progress
                  value={((successfulUpload + failedUpload) / uploadResult.length) * 100}
                  colorScheme={
                    successfulUpload + failedUpload === uploadResult.length ? "green" : "blue"
                  }
                  size="sm"
                  borderRadius="md"
                />
                <Text mt={2} fontSize="sm" fontWeight="semibold" color="gray.700">
                  Uploading Traits: [{successfulUpload + failedUpload}/{uploadResult.length}]
                </Text>
              </Box>
            </Box>
          )}

          {!showstats && (
            <Flex justifyContent="flex-end">
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                disabled={
                  Object.keys(uploadResult[0]).filter((key) => key.includes("|false")).length !=
                    0 ||
                  Object.entries(uploadResult[0]).filter(
                    ([key, value]) => key.includes("|DATE") && value.split("|").length != 2
                  ).length != 0
                }
              >
                Batch Upload
              </Button>
            </Flex>
          )}
          <Box>
            <Text fontSize="lg" mb={4}>
              <Text as="span" color="blue.500" fontWeight="bold">
                {Object.keys(uploadResult[0]).filter((key) => key.includes("|true")).length}
              </Text>{" "}
              out of{" "}
              <Text as="span" fontWeight="bold">
                {Object.keys(uploadResult[0]).length - 8}
              </Text>{" "}
              traits matched successfully.
            </Text>
            {Object.keys(uploadResult[0]).filter((key) => key.includes("|false")).length != 0 && (
              <Box bg="red.500" color="white" p={4} borderRadius="md" boxShadow="md" mb={4}>
                <Text fontSize="md" fontWeight="bold">
                  <Icon as={WarningIcon} w={5} h={5} mr={4} />
                  Warning: {"Couldn't find any matches for the following traits"}!
                </Text>
                {Object.keys(uploadResult[0])
                  .filter((key) => key.includes("|false"))
                  .map((key) => (
                    <Box ml={9}>
                      <Link href={`/traits/create?name=${key.split("|")[0]}`}>
                        {key.split("|")[0]}
                      </Link>
                    </Box>
                  ))}
              </Box>
            )}
            {Object.entries(uploadResult[0]).filter(
              ([key, value]) => key.includes("|DATE") && value.split("|").length != 2
            ).length != 0 && (
              <Box bg="red.500" color="white" p={4} borderRadius="md" boxShadow="md" mb={4}>
                <Text fontSize="md" fontWeight="bold">
                  <Icon as={WarningIcon} w={5} h={5} mr={4} />
                  Warning: {"Please add a units column for the following date traits"}!
                </Text>
                {Object.entries(uploadResult[0])
                  .filter(([key, value]) => key.includes("|DATE") && value.split("|").length != 2)
                  .map(([key]) => (
                    <Box ml={9}>{key.split("|")[0]}</Box>
                  ))}
              </Box>
            )}
            <table style={{ borderWidth: "2px", width: "100%" }}>
              <tbody>
                {uploadResult &&
                  uploadResult.map((item, index) => (
                    <tr style={{ borderWidth: "2px" }}>
                      <Box m={4}>
                        <Button
                          onClick={() =>
                            setExpandedRows((prev) =>
                              prev.includes(index)
                                ? prev.filter((rowId) => rowId !== index)
                                : [...prev, index]
                            )
                          }
                          mr={4}
                          borderRadius="50%"
                          variant="outline"
                          colorScheme="teal"
                          size="xs"
                        >
                          {expandedRows.includes(index) ? "-" : "+"}
                        </Button>
                        <span style={{ fontWeight: "bold" }}>{item["Species"]}</span>
                        {expandedRows.includes(index) && (
                          <Box ml={8}>
                            <Heading fontSize="medium" m={2}>
                              💎 {"Traits"}
                            </Heading>
                            <Box ml={8}>
                              <table className="table table-bordered">
                                <tbody>
                                  {Object.entries(item).map(([key, values]) => (
                                    <>
                                      {key.split("|")[1] == "true" &&
                                        values != null &&
                                        (key.split("|")[2] !== "DATE" ||
                                          values.split("|").length === 2) && (
                                          <tr>
                                            <td>
                                              <LocalLink
                                                href={`/traits/show/${key.split("|")[3]}`}
                                                prefixGroup={true}
                                              >
                                                <BlueLink>{key.split("|")[0]} </BlueLink>
                                              </LocalLink>
                                            </td>
                                            <td>
                                              {key.split("|")[2] == "STRING" && (
                                                <>
                                                  <SimpleGrid
                                                    columns={{ base: 1, md: 3 }}
                                                    spacing={4}
                                                  >
                                                    {values
                                                      .slice(0, -1)
                                                      .split(",")
                                                      .filter(
                                                        (value) => value.split("|")[0] !== "NoMatch"
                                                      )
                                                      .map((value) => (
                                                        <Stack borderWidth={2} borderRadius="md">
                                                          {value.split("|")[2] && (
                                                            <Image
                                                              src={getTraitIcon(
                                                                value.split("|")[2],
                                                                20
                                                              )}
                                                              boxSize="1.25rem"
                                                              objectFit="contain"
                                                              display="inline"
                                                              verticalAlign="center"
                                                              mr={1}
                                                              ignoreFallback={true}
                                                            />
                                                          )}
                                                          <Text>{value.split("|")[1]}</Text>
                                                        </Stack>
                                                      ))}
                                                  </SimpleGrid>
                                                  {values
                                                    .slice(0, -1)
                                                    .split(",")
                                                    .filter(
                                                      (value) => value.split("|")[0] === "NoMatch"
                                                    ).length != 0 && (
                                                    <Alert bg="red.500" color="white" mt={2}>
                                                      <AlertIcon color="white" />
                                                      <Text>
                                                        {"Couldn't find values: " +
                                                          values
                                                            .slice(0, -1) // Slice the array as before
                                                            .split(",") // Split each value by comma
                                                            .flat() // Flatten the resulting array of arrays into a single array
                                                            .filter(
                                                              (value) =>
                                                                value.split("|")[0] === "NoMatch"
                                                            ) // Filter for NoMatch
                                                            .map((value) => value.split("|")[1]) // Extract the value part after "NoMatch"
                                                            .join(", ")}
                                                      </Text>
                                                    </Alert>
                                                  )}
                                                </>
                                              )}
                                              {key.split("|")[2] == "NUMERIC" && (
                                                <SimpleGrid
                                                  columns={{ base: 1, md: 3 }}
                                                  spacing={4}
                                                >
                                                  <Flex
                                                    border="2px"
                                                    borderColor="gray.300"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    borderRadius="md"
                                                    lineHeight={1}
                                                    h="3.25rem"
                                                  >
                                                    <div>{values}</div>
                                                  </Flex>
                                                </SimpleGrid>
                                              )}
                                              {key.split("|")[2] == "DATE" &&
                                                values.split("|").length == 2 && (
                                                  <SimpleGrid
                                                    columns={{ base: 1, md: 3 }}
                                                    spacing={4}
                                                  >
                                                    <Flex
                                                      border="2px"
                                                      borderColor="gray.300"
                                                      alignItems="center"
                                                      justifyContent="center"
                                                      borderRadius="md"
                                                      lineHeight={1}
                                                      h="3.25rem"
                                                    >
                                                      <div>{values.split("|")[0]}</div>
                                                    </Flex>
                                                  </SimpleGrid>
                                                )}
                                              {key.split("|")[2] == "COLOR" && (
                                                <SimpleGrid
                                                  columns={{ base: 1, md: 3 }}
                                                  spacing={4}
                                                >
                                                  {values
                                                    .slice(0, -1)
                                                    .split("|")
                                                    .map((value) => (
                                                      <Box
                                                        border="2px"
                                                        borderColor="rgba(0,0,0,0.1)"
                                                        borderRadius="md"
                                                        lineHeight={1}
                                                        h="3.25rem"
                                                        bg={value}
                                                      />
                                                    ))}
                                                </SimpleGrid>
                                              )}
                                            </td>
                                          </tr>
                                        )}
                                    </>
                                  ))}
                                </tbody>
                              </table>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Box>
        </>
      )}
    </Box>
  );
}
