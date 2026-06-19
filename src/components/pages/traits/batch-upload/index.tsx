import {
  Box,
  Button,
  FileUpload,
  Flex,
  Heading,
  Image,
  Link,
  Progress,
  SimpleGrid,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import UploadIcon from "@components/pages/observation/create-next/media-picker/upload-icon";
import { axUpdateSpeciesTrait, axUploadTraitsFile } from "@services/traits.service";
import { axGetUserList } from "@services/user.service";
import { REQUIRED_COLUMNS } from "@static/constants";
import { getTraitIcon } from "@utils/media";
import notification from "@utils/notification";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useState } from "react";
import { LuCircleAlert } from "react-icons/lu";

import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

import ColumnMapper from "../common/column-mapper";

const ACCEPT_STRING =
  "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export default function TraitsBatchUpload({ traits, languages }) {
  function groupByLanguageId(list) {
    const grouped = {};

    for (let i = 0; i < list.length; i++) {
      const obj = list[i];
      const key = languages.filter((lang) => lang.id === obj.languageId)[0].name;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push("Traits|" + obj.name + "|" + obj.id);
    }

    return grouped;
  }

  const [uploadResult, setUploadResult] = useState<Map<string, string>[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [failedTraitNames, setFailedTraitNames] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [columnMapping, setColumnMapping] = useState<[number, string][]>([]);
  const [headersMapping, setHeadersMapping] = useState<string[]>([]);
  const { open: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
  const [successfulUpload, setSuccessfulUpload] = useState(0);
  const [failedUpload, setFailedUpload] = useState(0);
  const [showstats, setshowstats] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const options = [
    "ScientificName",
    "TaxonConceptId",
    "SpeciesId",
    "Attribution",
    "Contributor",
    "License"
  ];
  const { t } = useTranslation();

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      const targetFile = details.acceptedFiles[0];

      if (details.rejectedFiles && details.rejectedFiles.length > 0) {
        notification(t("traits:trait_matching.excel_file_error"));
        return;
      }

      if (targetFile) {
        setFile(targetFile);
        try {
          const workbook = new ExcelJS.Workbook();
          const arrayBuffer = await targetFile.arrayBuffer();
          await workbook.xlsx.load(arrayBuffer);

          const worksheet = workbook.worksheets[0];
          const firstRow = worksheet.getRow(1);
          const extractedHeaders: string[] = [];

          firstRow.eachCell((cell, colNumber) => {
            if (cell.value) {
              const cellValue = cell.value.toString();
              extractedHeaders.push(`${cellValue}|${colNumber - 1}`);
              if (options.some((option) => option.toLowerCase() === cellValue.toLowerCase())) {
                setColumnMapping((prev) => {
                  const updatedOptions = [...prev];
                  const existingIndex = updatedOptions.findIndex(([i]) => i === colNumber - 1);

                  if (existingIndex !== -1) {
                    updatedOptions[existingIndex] = [colNumber - 1, cellValue];
                  } else {
                    updatedOptions.push([colNumber - 1, cellValue]);
                  }
                  return updatedOptions;
                });
              }
            }
          });
          setHeadersMapping(extractedHeaders);
          onOpen1();
        } catch (error) {
          console.error(t("traits:trait_matching.excel_file_error"), error);
        }
      } else {
        alert(t("traits:trait_matching.no_file_error"));
      }
    },
    [onOpen1, t]
  );

  const handleSubmit = async () => {
    setshowstats(true);
    const failedNames: string[] = [];
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
          facts[
            key.split("|")[3] +
              ("Attribution" in uploadResult[i] ? "|" + uploadResult[i]["Attribution"] : "")
          ] = value
            .slice(0, -1)
            .split(",")
            .map((trait) => trait.split("|")[0]);
        }
        if (key.split("|")[2] == "NUMERIC" && value) {
          facts[
            key.split("|")[3] +
              ("Attribution" in uploadResult[i] ? "|" + uploadResult[i]["Attribution"] : "")
          ] = [value];
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
          facts[
            key.split("|")[3] +
              ("Attribution" in uploadResult[i] ? "|" + uploadResult[i]["Attribution"] : "")
          ] = dates;
        }
        if (key.split("|")[2] == "COLOR" && value) {
          facts[
            key.split("|")[3] +
              ("Attribution" in uploadResult[i] ? "|" + uploadResult[i]["Attribution"] : "")
          ] = value.slice(0, -1).split("|");
        }
      });
      const { success, data } = await axGetUserList({
        email: uploadResult[i]["Contributor"]
      });
      if (success) {
        if (Object.keys(facts).length != 0) {
          if (uploadResult[i]["Species Id"] && uploadResult[i]["Taxon Concept Id"]) {
            const { success } = await axUpdateSpeciesTrait(
              parseInt(uploadResult[i]["Species Id"], 10),
              facts,
              data["userList"][0]["id"],
              parseInt(uploadResult[i]["Taxon Concept Id"], 10)
            );
            if (success) {
              setSuccessfulUpload((prev) => prev + 1);
            } else {
              setFailedUpload((prev) => prev + 1);
              failedNames.push(uploadResult[i]["Scientific Name"]);
              notification(
                `Something went wrong while adding traits to ${uploadResult[i]["Scientific Name"]}`
              );
            }
          } else if (!uploadResult[i]["Taxon Concept Id"]) {
            setFailedUpload((prev) => prev + 1);
            failedNames.push(uploadResult[i]["Scientific Name"]);
            notification(`Taxon Id not available for ${uploadResult[i]["Scientific Name"]}`);
          } else if (!uploadResult[i]["Species Id"]) {
            setFailedUpload((prev) => prev + 1);
            failedNames.push(uploadResult[i]["Scientific Name"]);
            notification(`Species Page doesn't exist for ${uploadResult[i]["Scientific Name"]}`);
          }
        } else {
          setSuccessfulUpload((prev) => prev + 1);
        }
      } else {
        setFailedUpload((prev) => prev + 1);
        failedNames.push(uploadResult[i]["Scientific Name"]);
        notification(`Couldn't retrieve userId of ${uploadResult[i]["Contributor"]}`);
      }
    }
    setFailedTraitNames(failedNames);
  };

  const columnMappingSubmit = async () => {
    if (REQUIRED_COLUMNS.some((col) => !columnMapping.some(([, i]) => i === col))) {
      notification("Please map ScientificName, TaxonConceptId, SpeciesId and Contributor");
    } else {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }

      formData.append(
        "scientificName",
        columnMapping.filter(([, i]) => i === "ScientificName")[0][0].toString()
      );

      formData.append(
        "TaxonConceptId",
        columnMapping.filter(([, i]) => i === "TaxonConceptId")[0][0].toString()
      );

      formData.append(
        "SpeciesId",
        columnMapping.filter(([, i]) => i === "SpeciesId")[0][0].toString()
      );

      formData.append(
        "Contributor",
        columnMapping.filter(([, i]) => i === "Contributor")[0][0].toString()
      );

      if (columnMapping.filter(([, i]) => i === "Attribution").length > 0) {
        formData.append(
          "Attribution",
          columnMapping.filter(([, i]) => i === "Attribution")[0][0].toString()
        );
      }

      if (columnMapping.filter(([, i]) => i === "License").length > 0) {
        formData.append(
          "License",
          columnMapping.filter(([, i]) => i === "License")[0][0].toString()
        );
      }

      formData.append(
        "traits",
        columnMapping
          .filter(([, i]) => i.split("|")[0] === "Traits")
          .map(([first, second]) => first + ":" + second.split("|")[2])
          .join("|")
      );

      const { success, data } = await axUploadTraitsFile(formData);
      onClose1();
      if (success) {
        setUploadResult(data);
        setCurrentStep(2);
      }
    }
  };

  return (
    <Box p={4}>
      <Alert status="info" borderRadius="md" mb={4} alignItems="top">
        {t("traits:trait_matching.description")}
      </Alert>
      {currentStep == 1 && (
        <FileUpload.Root
          accept={ACCEPT_STRING}
          onFileChange={handleFileChange}
          maxFiles={1}
          width="full"
        >
          <FileUpload.HiddenInput />

          <FileUpload.Context>
            {(fileUpload) => (
              <FileUpload.Dropzone
                asChild
                border="none"
                p={0}
                minH="calc(100vh - var(--heading-height))"
                id="dropzone"
                cursor="inherit"
                width="full"
              >
                <Box bg={fileUpload.dragging ? "blue.100" : undefined} width="full" height="full">
                  <Flex
                    minH="calc(100vh - var(--heading-height))"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Flex flexDir="column" alignItems="center" p={4}>
                      <UploadIcon size={100} />
                      <Heading size="lg" fontWeight="normal" color="gray.400" mt={8}>
                        {t("traits:trait_matching.browse_description")}
                      </Heading>
                      <Button
                        colorPalette="blue"
                        onClick={() => fileUpload.openFilePicker()}
                        mb={8}
                      >
                        {t("traits:trait_matching.browse_button")}
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              </FileUpload.Dropzone>
            )}
          </FileUpload.Context>
        </FileUpload.Root>
      )}

      <ColumnMapper
        options={options}
        manyOptions={Object.entries(groupByLanguageId(traits))}
        isOpen={isOpen1}
        onClose={onClose1}
        description={t("traits:trait_matching.column_mapping_description")}
        headers={headersMapping}
        columnMapping={columnMapping}
        setColumnMapping={setColumnMapping}
        onSubmit={columnMappingSubmit}
        optionDisabled={columnMapping.filter(([, i]) => i.split("|")[0] === "Traits").length == 0}
      />
      {currentStep != 1 && (
        <>
          {showstats && (
            <Box textAlign="center" p={4} borderWidth="1px" borderRadius="md" boxShadow="md" mb={2}>
              <Heading size="md" mb={2} color={"blue.600"}>
                {successfulUpload + failedUpload === uploadResult.length
                  ? failedUpload > 0
                    ? t("traits:trait_matching.traits_saved")
                    : t("traits:trait_matching.traits_successfull")
                  : t("traits:trait_matching.processing")}
              </Heading>

              <Text fontSize="sm" color="gray.600">
                {successfulUpload + failedUpload === uploadResult.length
                  ? failedUpload > 0
                    ? t("traits:trait_matching.failed_upload")
                    : t("traits:trait_matching.successfull_upload_message")
                  : t("traits:trait_matching.processing_message")}
              </Text>

              <Box mt={4}>
                <Progress.Root
                  value={((successfulUpload + failedUpload) / uploadResult.length) * 100}
                >
                  <Progress.Track>
                    <Progress.Range bg="blue.500" />
                  </Progress.Track>
                </Progress.Root>
                <Text mt={2} fontSize="sm" fontWeight="semibold" color="gray.700">
                  Uploading Traits: [{successfulUpload + failedUpload}/{uploadResult.length}]
                </Text>
              </Box>
              {failedUpload > 0 && failedTraitNames.length > 0 && (
                <Box mt={3} p={2} bg="red.50" borderRadius="md">
                  <Text fontSize="sm" fontWeight="semibold" color="red.600">
                    {t("traits:trait_matching.failed_description")}
                  </Text>
                  <Box>
                    {failedTraitNames.map((name, index) => (
                      <Text key={index} fontSize="sm" color="red.500">
                        - {name}
                      </Text>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
          <Box>
            {Object.entries(uploadResult[0] || {}).filter(
              ([key, value]) =>
                key.includes("|DATE") && typeof value === "string" && value.split("|").length != 2
            ).length != 0 && (
              <Box bg="red.500" color="white" p={4} borderRadius="md" boxShadow="md" mb={4}>
                <Flex align="center" gap={2} fontSize="md" fontWeight="bold">
                  <LuCircleAlert />
                  <Text>Warning: Please add a units column for the following date traits!</Text>
                </Flex>
                {Object.entries(uploadResult[0] || {})
                  .filter(
                    ([key, value]) =>
                      key.includes("|DATE") &&
                      typeof value === "string" &&
                      value.split("|").length != 2
                  )
                  .map(([key]) => (
                    <Box ml={9} key={key}>
                      {key.split("|")[0]}
                    </Box>
                  ))}
              </Box>
            )}
            <table style={{ borderWidth: "2px", width: "100%" }}>
              <tbody>
                {uploadResult &&
                  uploadResult.map((item, index) => (
                    <tr style={{ borderWidth: "2px" }} key={index}>
                      <td>
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
                            colorPalette="teal"
                            size="xs"
                          >
                            {expandedRows.includes(index) ? "-" : "+"}
                          </Button>
                          <span style={{ fontWeight: "bold" }}>
                            <Link
                              href={`/species/show/${parseInt(item["Species Id"], 10)}`}
                              target="_blank"
                            >
                              {item["Scientific Name"]}
                            </Link>
                          </span>
                          {expandedRows.includes(index) && (
                            <Box ml={8}>
                              <Heading fontSize="medium" m={2}>
                                💎 {t("traits:trait_matching.traits")}
                              </Heading>
                              <Box ml={8}>
                                <table className="table table-bordered">
                                  <tbody>
                                    {Object.entries(item).map(([key, values]) => (
                                      <React.Fragment key={key}>
                                        {key.split("|")[1] == "true" &&
                                          values != null &&
                                          typeof values === "string" &&
                                          (key.split("|")[2] !== "DATE" ||
                                            values.split("|").length === 2) && (
                                            <tr>
                                              <td>
                                                <BlueLink asChild>
                                                  <LocalLink
                                                    href={`/traits/show/${key.split("|")[3]}`}
                                                    prefixGroup={true}
                                                  >
                                                    {key.split("|")[0]}
                                                  </LocalLink>
                                                </BlueLink>
                                              </td>
                                              <td>
                                                {key.split("|")[2] == "STRING" && (
                                                  <>
                                                    <SimpleGrid
                                                      columns={{ base: 1, md: 3 }}
                                                      gap={4}
                                                    >
                                                      {values
                                                        .slice(0, -1)
                                                        .split(",")
                                                        .filter(
                                                          (value) =>
                                                            value.split("|")[0] !== "NoMatch"
                                                        )
                                                        .map((value, vIdx) => (
                                                          <Flex
                                                            key={vIdx}
                                                            alignItems="center"
                                                            border="2px"
                                                            borderColor="gray.200"
                                                            borderRadius="md"
                                                            lineHeight={1}
                                                            p={2}
                                                            h="3.25rem"
                                                          >
                                                            {value.split("|")[2] && (
                                                              <Image
                                                                objectFit="contain"
                                                                boxSize="32px"
                                                                mr={2}
                                                                src={getTraitIcon(
                                                                  value.split("|")[2],
                                                                  20
                                                                )}
                                                                alt={value.split("|")[1]}
                                                              />
                                                            )}
                                                            <div>{value.split("|")[1]}</div>
                                                          </Flex>
                                                        ))}
                                                    </SimpleGrid>
                                                    {values
                                                      .slice(0, -1)
                                                      .split(",")
                                                      .filter(
                                                        (value) => value.split("|")[0] === "NoMatch"
                                                      ).length != 0 && (
                                                      <Alert bg="red.500" color="white" mt={2}>
                                                        <Text>
                                                          {"Couldn't find values: " +
                                                            values
                                                              .slice(0, -1)
                                                              .split(",")
                                                              .flat()
                                                              .filter(
                                                                (value) =>
                                                                  value.split("|")[0] === "NoMatch"
                                                              )
                                                              .map((value) => value.split("|")[1])
                                                              .join(", ")}
                                                        </Text>
                                                      </Alert>
                                                    )}
                                                  </>
                                                )}
                                                {key.split("|")[2] == "NUMERIC" && (
                                                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
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
                                                      gap={4}
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
                                                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                                                    {values
                                                      .slice(0, -1)
                                                      .split("|")
                                                      .map((value, cIdx) => (
                                                        <Box
                                                          key={cIdx}
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
                                      </React.Fragment>
                                    ))}
                                  </tbody>
                                </table>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Box mt={4}>
              <Checkbox
                checked={termsAccepted}
                onCheckedChange={(e) => setTermsAccepted(!!e.checked)}
                colorPalette={"blue"}
              >
                {t("traits:terms.description")}
              </Checkbox>
              {!termsAccepted && (
                <Text color="red.500">{t("traits:trait_matching.terms_warning")}</Text>
              )}
            </Box>
            {!showstats && (
              <Flex justifyContent="flex-end" mt={4}>
                <Button
                  colorPalette="blue"
                  onClick={handleSubmit}
                  disabled={
                    (uploadResult[0] &&
                      Object.keys(uploadResult[0]).filter((key) => key.includes("|false")).length !=
                        0) ||
                    (uploadResult[0] &&
                      Object.entries(uploadResult[0]).filter(
                        ([key, value]) =>
                          key.includes("|DATE") &&
                          typeof value === "string" &&
                          value.split("|").length != 2
                      ).length != 0) ||
                    !termsAccepted
                  }
                >
                  {t("traits:trait_matching.batch_upload")}
                </Button>
              </Flex>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
